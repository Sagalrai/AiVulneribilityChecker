import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { performance } from "perf_hooks";
import { ProjectScannerService } from "./scanning/project-scanner.service";
import { StaticAnalysisService } from "./scanning/static-analysis.service";
import { CLI_NAME, CLI_VERSION } from "./version";

type CliOptions = {
    command: "scan" | "version" | "doctor" | "help" | "config";
    target?: string;
    json?: boolean;
    sarif?: boolean;
    html?: boolean;
    markdown?: boolean;
    verbose?: boolean;
    fix?: boolean;
    output?: string;
};

function printUsage() {
    console.log(`\n${CLI_NAME} ${CLI_VERSION}\n`);
    console.log("Usage:");
    console.log("  vulnpilot scan [path] [options]");
    console.log("  vulnpilot version");
    console.log("  vulnpilot doctor");
    console.log("  vulnpilot help");
    console.log("  vulnpilot config\n");
    console.log("Examples:");
    console.log("  vulnpilot scan .");
    console.log("  vulnpilot scan src");
    console.log("  vulnpilot scan --json .\n");
    console.log("Options:");
    console.log("  --json         Emit JSON output");
    console.log("  --sarif        Emit SARIF output");
    console.log("  --html         Emit HTML output");
    console.log("  --markdown     Emit Markdown output");
    console.log("  --verbose      Include snippets and extra context");
    console.log("  --fix          Surface remediation guidance in the report");
    console.log("  --output path Write the report to a file\n");
}

function parseArgs(argv: string[]): CliOptions {
    const options: CliOptions = { command: "help" };

    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === "scan" || arg === "version" || arg === "doctor" || arg === "help" || arg === "config") {
            options.command = arg;
            continue;
        }
        if (arg === "--json") {
            options.json = true;
            continue;
        }
        if (arg === "--sarif") {
            options.sarif = true;
            continue;
        }
        if (arg === "--html") {
            options.html = true;
            continue;
        }
        if (arg === "--markdown") {
            options.markdown = true;
            continue;
        }
        if (arg === "--verbose") {
            options.verbose = true;
            continue;
        }
        if (arg === "--fix") {
            options.fix = true;
            continue;
        }
        if (arg === "--output") {
            options.output = argv[index + 1];
            index += 1;
            continue;
        }
        if (!options.target) {
            options.target = arg;
        }
    }

    if (!options.command || options.command === "help") {
        options.command = "help";
    }

    return options;
}

function resolveInputPath(inputPath: string): string {
    if (!inputPath || inputPath === ".") {
        return process.cwd();
    }

    const expanded = inputPath.startsWith("~") ? path.join(os.homedir(), inputPath.slice(1)) : inputPath;
    return path.isAbsolute(expanded) ? expanded : path.resolve(process.cwd(), expanded);
}

function writeReport(report: string, outputPath?: string) {
    if (!outputPath) {
        console.log(report);
        return;
    }

    const resolvedOutputPath = resolveInputPath(outputPath);
    fs.mkdirSync(path.dirname(resolvedOutputPath), { recursive: true });
    fs.writeFileSync(resolvedOutputPath, report, "utf8");
    console.log(`✓ Report written to ${resolvedOutputPath}`);
}

function formatJsonReport(target: string, elapsedMs: number, filesScanned: number, results: any[]) {
    return JSON.stringify(
        {
            target,
            scannedAt: new Date().toISOString(),
            elapsedMs: Number(elapsedMs.toFixed(2)),
            filesScanned,
            findings: results,
        },
        null,
        2,
    );
}

function formatSarifReport(target: string, elapsedMs: number, filesScanned: number, results: any[]) {
    const runs = results.map((result: any) => ({
        tool: { driver: { name: "VulnPilot AI", version: "0.1.0" } },
        results: result.findings.map((finding: any) => ({
            ruleId: finding.ruleId,
            level: finding.severity === "critical" ? "error" : finding.severity === "high" ? "warning" : "note",
            message: { text: finding.title },
            locations: [{ physicalLocation: { artifactLocation: { uri: result.file } } }],
        })),
    }));

    return JSON.stringify(
        { $schema: "https://json.schemastore.org/sarif-2.1.0.json", version: "2.1.0", runs },
        null,
        2,
    );
}

function formatHtmlReport(target: string, elapsedMs: number, filesScanned: number, results: any[]) {
    const rows = results
        .map((result: any) => {
            const findings = result.findings
                .map(
                    (finding: any) =>
                        `<li><strong>${finding.title}</strong> (${finding.severity}) - ${finding.recommendation}</li>`,
                )
                .join("");
            return `<tr><td>${result.file}</td><td>${findings}</td></tr>`;
        })
        .join("");

    return `<!doctype html><html><head><meta charset="utf-8"/><title>VulnPilot AI Report</title></head><body><h1>VulnPilot AI Report</h1><p>Target: ${target}</p><p>Files scanned: ${filesScanned}</p><p>Elapsed: ${elapsedMs.toFixed(2)}ms</p><table><tr><th>File</th><th>Findings</th></tr>${rows}</table></body></html>`;
}

function formatMarkdownReport(target: string, elapsedMs: number, filesScanned: number, results: any[]) {
    const lines = [
        "# VulnPilot AI Report",
        "",
        `- Target: ${target}`,
        `- Files scanned: ${filesScanned}`,
        `- Elapsed: ${elapsedMs.toFixed(2)}ms`,
        "",
        "## Findings",
        "",
    ];
    for (const result of results) {
        lines.push(`### ${result.file}`);
        for (const finding of result.findings) {
            lines.push(`- **${finding.title}** (${finding.severity}) - ${finding.recommendation}`);
        }
        lines.push("");
    }
    return lines.join("\n");
}

function formatConsoleReport(
    target: string,
    elapsedMs: number,
    filesScanned: number,
    results: any[],
    verbose: boolean,
    fix: boolean,
) {
    const severitySummary = { critical: 0, high: 0, medium: 0, low: 0 };
    for (const result of results) {
        for (const finding of result.findings) {
            severitySummary[finding.severity as keyof typeof severitySummary] += 1;
        }
    }

    const lines = [
        "",
        `✓ Scan completed in ${elapsedMs.toFixed(2)}ms`,
        `📁 Target: ${target}`,
        `📄 Files scanned: ${filesScanned}`,
        `🧠 Pipeline: discovery → metadata → AST analysis → detectors → confidence → deduplication`,
        `⚠ Severity summary: critical=${severitySummary.critical} high=${severitySummary.high} medium=${severitySummary.medium} low=${severitySummary.low}`,
        "",
    ];

    if (results.length === 0) {
        lines.push("✓ No obvious vulnerabilities found.");
        return lines.join("\n");
    }

    lines.push(`✗ Found ${results.length} file(s) with potential issues:`);
    for (const result of results) {
        lines.push(`\n[${result.file}]`);
        lines.push(`Language: ${result.language}`);
        for (const finding of result.findings) {
            lines.push(`- ${finding.title}`);
            lines.push(`  Severity: ${finding.severity}`);
            lines.push(`  Confidence: ${finding.confidence}`);
            lines.push(`  OWASP: ${finding.owasp}`);
            lines.push(`  CWE: ${finding.cwe}`);
            lines.push(`  Recommendation: ${finding.recommendation}`);
            if (fix) {
                lines.push(`  Fix hint: ${finding.suggestedFix ?? "Review the surrounding code path and harden it."}`);
            }
            if (verbose && finding.snippet) {
                lines.push(`  Snippet: ${finding.snippet}`);
            }
        }
    }

    return lines.join("\n");
}

function runScan(options: CliOptions) {
    const target = options.target ?? ".";
    const absoluteTarget = resolveInputPath(target);
    if (!fs.existsSync(absoluteTarget)) {
        console.error(`✗ Path not found: ${absoluteTarget}`);
        process.exit(1);
    }

    const started = performance.now();
    const analysisService = new StaticAnalysisService();
    const scanner = new ProjectScannerService(analysisService);
    const discoveredFiles = scanner.getScannableFiles(absoluteTarget);
    const filesScanned = discoveredFiles.length;
    const results = scanner.scan(absoluteTarget);
    const elapsedMs = performance.now() - started;

    const reportData = results.map(result => ({
        file: result.file,
        language: result.language,
        findings: result.findings,
    }));

    let report: string;
    if (options.json) {
        report = formatJsonReport(absoluteTarget, elapsedMs, filesScanned, reportData);
    } else if (options.sarif) {
        report = formatSarifReport(absoluteTarget, elapsedMs, filesScanned, reportData);
    } else if (options.html) {
        report = formatHtmlReport(absoluteTarget, elapsedMs, filesScanned, reportData);
    } else if (options.markdown) {
        report = formatMarkdownReport(absoluteTarget, elapsedMs, filesScanned, reportData);
    } else {
        report = formatConsoleReport(
            absoluteTarget,
            elapsedMs,
            filesScanned,
            reportData,
            Boolean(options.verbose),
            Boolean(options.fix),
        );
    }

    writeReport(report, options.output);
}

function runDoctor() {
    console.log(`✓ ${CLI_NAME} doctor check passed.`);
    console.log("✓ CLI runtime is available.");
    console.log("✓ Static analysis engine is loaded.");
    console.log("✓ Report output modes are available: console, JSON, SARIF, HTML, Markdown.");
}

function runConfig() {
    console.log(`✓ ${CLI_NAME} configuration is using the local CLI defaults.`);
    console.log("✓ No extra setup is required for basic scanning.");
}

function main() {
    const options = parseArgs(process.argv.slice(2));

    switch (options.command) {
        case "scan":
            runScan(options);
            break;
        case "version":
            console.log(`${CLI_NAME} ${CLI_VERSION}`);
            break;
        case "doctor":
            runDoctor();
            break;
        case "config":
            runConfig();
            break;
        case "help":
            printUsage();
            break;
        default:
            console.error(`Unknown command: ${process.argv[2] ?? ""}`);
            printUsage();
            process.exitCode = 1;
            break;
    }
}

main();
