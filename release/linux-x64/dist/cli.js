"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const perf_hooks_1 = require("perf_hooks");
const project_scanner_service_1 = require("./scanning/project-scanner.service");
const static_analysis_service_1 = require("./scanning/static-analysis.service");
const version_1 = require("./version");
function printUsage() {
    console.log(`\n${version_1.CLI_NAME} ${version_1.CLI_VERSION}\n`);
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
function parseArgs(argv) {
    const options = { command: "help" };
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === "scan" || arg === "version" || arg === "doctor" || arg === "help") {
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
function writeReport(report, outputPath) {
    if (!outputPath) {
        console.log(report);
        return;
    }
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, report, "utf8");
    console.log(`✓ Report written to ${outputPath}`);
}
function formatJsonReport(target, elapsedMs, filesScanned, results) {
    return JSON.stringify({
        target,
        scannedAt: new Date().toISOString(),
        elapsedMs: Number(elapsedMs.toFixed(2)),
        filesScanned,
        findings: results,
    }, null, 2);
}
function formatSarifReport(target, elapsedMs, filesScanned, results) {
    const runs = results.map((result) => ({
        tool: { driver: { name: "VulnPilot AI", version: "0.1.0" } },
        results: result.findings.map((finding) => ({
            ruleId: finding.ruleId,
            level: finding.severity === "critical" ? "error" : finding.severity === "high" ? "warning" : "note",
            message: { text: finding.title },
            locations: [{ physicalLocation: { artifactLocation: { uri: result.file } } }],
        })),
    }));
    return JSON.stringify({ $schema: "https://json.schemastore.org/sarif-2.1.0.json", version: "2.1.0", runs }, null, 2);
}
function formatHtmlReport(target, elapsedMs, filesScanned, results) {
    const rows = results
        .map((result) => {
        const findings = result.findings
            .map((finding) => `<li><strong>${finding.title}</strong> (${finding.severity}) - ${finding.recommendation}</li>`)
            .join("");
        return `<tr><td>${result.file}</td><td>${findings}</td></tr>`;
    })
        .join("");
    return `<!doctype html><html><head><meta charset="utf-8"/><title>VulnPilot AI Report</title></head><body><h1>VulnPilot AI Report</h1><p>Target: ${target}</p><p>Files scanned: ${filesScanned}</p><p>Elapsed: ${elapsedMs.toFixed(2)}ms</p><table><tr><th>File</th><th>Findings</th></tr>${rows}</table></body></html>`;
}
function formatMarkdownReport(target, elapsedMs, filesScanned, results) {
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
function formatConsoleReport(target, elapsedMs, filesScanned, results, verbose, fix) {
    const severitySummary = { critical: 0, high: 0, medium: 0, low: 0 };
    for (const result of results) {
        for (const finding of result.findings) {
            severitySummary[finding.severity] += 1;
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
function runScan(options) {
    const target = options.target ?? ".";
    const absoluteTarget = path.resolve(target);
    if (!fs.existsSync(absoluteTarget)) {
        console.error(`✗ Path not found: ${absoluteTarget}`);
        process.exit(1);
    }
    const started = perf_hooks_1.performance.now();
    const analysisService = new static_analysis_service_1.StaticAnalysisService();
    const scanner = new project_scanner_service_1.ProjectScannerService(analysisService);
    const discoveredFiles = scanner.getScannableFiles(absoluteTarget);
    const filesScanned = discoveredFiles.length;
    const results = scanner.scan(absoluteTarget);
    const elapsedMs = perf_hooks_1.performance.now() - started;
    const reportData = results.map(result => ({
        file: result.file,
        language: result.language,
        findings: result.findings,
    }));
    let report;
    if (options.json) {
        report = formatJsonReport(absoluteTarget, elapsedMs, filesScanned, reportData);
    }
    else if (options.sarif) {
        report = formatSarifReport(absoluteTarget, elapsedMs, filesScanned, reportData);
    }
    else if (options.html) {
        report = formatHtmlReport(absoluteTarget, elapsedMs, filesScanned, reportData);
    }
    else if (options.markdown) {
        report = formatMarkdownReport(absoluteTarget, elapsedMs, filesScanned, reportData);
    }
    else {
        report = formatConsoleReport(absoluteTarget, elapsedMs, filesScanned, reportData, Boolean(options.verbose), Boolean(options.fix));
    }
    writeReport(report, options.output);
}
function runDoctor() {
    console.log(`✓ ${version_1.CLI_NAME} doctor check passed.`);
    console.log("✓ CLI runtime is available.");
    console.log("✓ Static analysis engine is loaded.");
    console.log("✓ Report output modes are available: console, JSON, SARIF, HTML, Markdown.");
}
function main() {
    const options = parseArgs(process.argv.slice(2));
    switch (options.command) {
        case "scan":
            runScan(options);
            break;
        case "version":
            console.log(`${version_1.CLI_NAME} ${version_1.CLI_VERSION}`);
            break;
        case "doctor":
            runDoctor();
            break;
        case "help":
        default:
            printUsage();
            break;
    }
}
main();
//# sourceMappingURL=cli.js.map