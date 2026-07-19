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
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const perf_hooks_1 = require("perf_hooks");
const project_scanner_service_1 = require("./scanning/project-scanner.service");
const static_analysis_service_1 = require("./scanning/static-analysis.service");
const version_1 = require("./version");
// ── ANSI color helpers ──────────────────────────────────────────────────────
const C = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",
    // foreground
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    // background
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
};
function color(text, code, bold = false) {
    return `${bold ? C.bold : ""}${code}${text}${C.reset}`;
}
function green(text, bold = false) {
    return color(text, C.green, bold);
}
function red(text, bold = false) {
    return color(text, C.red, bold);
}
function yellow(text, bold = false) {
    return color(text, C.yellow, bold);
}
function blue(text, bold = false) {
    return color(text, C.blue, bold);
}
function cyan(text, bold = false) {
    return color(text, C.cyan, bold);
}
function magenta(text, bold = false) {
    return color(text, C.magenta, bold);
}
function dim(text) {
    return `${C.dim}${text}${C.reset}`;
}
function icon(emoji) {
    return `${emoji} `;
}
// ── First-run tracking ──────────────────────────────────────────────────────
function getConfigDir() {
    return path.join(os.homedir(), ".config", "vulnpilot");
}
function getFirstRunSentinelPath() {
    return path.join(getConfigDir(), ".first-run-done");
}
function isFirstRun() {
    return !fs.existsSync(getFirstRunSentinelPath());
}
function markFirstRunDone() {
    const configDir = getConfigDir();
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }
    fs.writeFileSync(getFirstRunSentinelPath(), new Date().toISOString(), "utf-8");
}
// ── Welcome message ─────────────────────────────────────────────────────────
function showWelcome() {
    const shield = `${C.bold}${C.cyan}╔══════════════════════════════════════════╗${C.reset}`;
    const title = `${C.bold}${C.cyan}║${C.reset}  ${C.bold}${C.white}VulnPilot AI${C.reset} ${C.magenta}🛡️${C.reset}              ${C.cyan}║${C.reset}`;
    const subtitle = `${C.bold}${C.cyan}║${C.reset}  ${C.dim}Your AI-powered security scanner${C.reset}  ${C.cyan}║${C.reset}`;
    const bottom = `${C.bold}${C.cyan}╚══════════════════════════════════════════╝${C.reset}`;
    console.log(`\n${shield}`);
    console.log(`${title}`);
    console.log(`${subtitle}`);
    console.log(`${bottom}\n`);
    console.log(`${green("✓")} VulnPilot is ready to scan your projects for security issues.`);
    console.log(`${green("✓")} No configuration needed — just point it at your code.\n`);
    console.log(`${C.bold}Quick start:${C.reset}`);
    console.log(`  ${cyan("vulnpilot scan <your-project-folder>")}`);
    console.log(`  ${dim("Example:")} ${cyan("vulnpilot scan ./my-project")}\n`);
    console.log(`${C.bold}Available commands:${C.reset}`);
    console.log(`  ${cyan("vulnpilot scan")}     ${dim("Scan a project for security vulnerabilities")}`);
    console.log(`  ${cyan("vulnpilot help")}     ${dim("Show this help message")}`);
    console.log(`  ${cyan("vulnpilot version")}  ${dim("Show the installed version")}`);
    console.log(`  ${cyan("vulnpilot doctor")}   ${dim("Check if everything is set up correctly")}\n`);
}
// ── Help / Usage ────────────────────────────────────────────────────────────
function printUsage() {
    const shield = `${C.cyan}${C.bold}╔══════════════════════════════════════════╗${C.reset}`;
    const headerLine = `${C.cyan}${C.bold}║${C.reset}  ${C.bold}${C.white}VulnPilot AI${C.reset} ${C.magenta}🛡️${C.reset}  ${C.bold}v${version_1.CLI_VERSION}${C.reset}       ${C.cyan}${C.bold}║${C.reset}`;
    const bottom = `${C.cyan}${C.bold}╚══════════════════════════════════════════╝${C.reset}`;
    console.log(`\n${shield}`);
    console.log(`${headerLine}`);
    console.log(`${bottom}\n`);
    console.log(`${C.bold}${C.white}USAGE${C.reset}`);
    console.log(`  ${cyan("vulnpilot scan [path] [options]")}`);
    console.log(`  ${cyan("vulnpilot help")}`);
    console.log(`  ${cyan("vulnpilot version")}`);
    console.log(`  ${cyan("vulnpilot doctor")}\n`);
    console.log(`${C.bold}${C.white}COMMANDS${C.reset}`);
    console.log(`  ${cyan("scan")}     ${dim("Scan a project folder for security vulnerabilities")}`);
    console.log(`  ${cyan("help")}     ${dim("Show this help message")}`);
    console.log(`  ${cyan("version")}  ${dim("Show the installed version")}`);
    console.log(`  ${cyan("doctor")}   ${dim("Check if your installation is working correctly")}\n`);
    console.log(`${C.bold}${C.white}EXAMPLES${C.reset}`);
    console.log(`  ${cyan("vulnpilot scan .")}              ${dim("Scan the current folder")}`);
    console.log(`  ${cyan("vulnpilot scan ./src")}          ${dim("Scan a specific folder")}`);
    console.log(`  ${cyan("vulnpilot scan --json .")}       ${dim("Get results in JSON format")}`);
    console.log(`  ${cyan("vulnpilot scan --html .")}       ${dim("Generate an HTML report")}\n`);
    console.log(`${C.bold}${C.white}OPTIONS${C.reset}`);
    console.log(`  ${cyan("--json")}         ${dim("Output results as JSON")}`);
    console.log(`  ${cyan("--html")}         ${dim("Generate an HTML report")}`);
    console.log(`  ${cyan("--markdown")}     ${dim("Generate a Markdown report")}`);
    console.log(`  ${cyan("--sarif")}        ${dim("Output results in SARIF format (for CI tools)")}`);
    console.log(`  ${cyan("--verbose")}      ${dim("Show detailed information about each finding")}`);
    console.log(`  ${cyan("--fix")}          ${dim("Include fix suggestions in the report")}`);
    console.log(`  ${cyan("--output")}       ${dim("Save the report to a file")}\n`);
    console.log(`${C.bold}${C.white}NEED HELP?${C.reset}`);
    console.log(`  ${dim("Visit:")} ${cyan("https://github.com/Sagalrai/AiVulneribilityChecker")}\n`);
}
// ── Argument parsing ────────────────────────────────────────────────────────
function parseArgs(argv) {
    const options = { command: "help" };
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
// ── Path resolution ─────────────────────────────────────────────────────────
function resolveInputPath(inputPath) {
    if (!inputPath || inputPath === ".") {
        return process.cwd();
    }
    const expanded = inputPath.startsWith("~") ? path.join(os.homedir(), inputPath.slice(1)) : inputPath;
    return path.isAbsolute(expanded) ? expanded : path.resolve(process.cwd(), expanded);
}
function writeReport(report, outputPath) {
    if (!outputPath) {
        console.log(report);
        return;
    }
    const resolvedOutputPath = resolveInputPath(outputPath);
    fs.mkdirSync(path.dirname(resolvedOutputPath), { recursive: true });
    fs.writeFileSync(resolvedOutputPath, report, "utf8");
    console.log(`\n${green("✓")} Report saved to ${cyan(resolvedOutputPath)}`);
}
// ── Report formatters ───────────────────────────────────────────────────────
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
    const lines = [];
    // Summary header
    lines.push(`\n${C.bold}${C.white}📋 Scan Summary${C.reset}`);
    lines.push(`${dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")}`);
    lines.push(`${green("✓")} Scan completed in ${cyan(`${elapsedMs.toFixed(0)}ms`)}`);
    lines.push(`  ${dim("Target:")} ${cyan(target)}`);
    lines.push(`  ${dim("Files scanned:")} ${cyan(String(filesScanned))}`);
    lines.push("");
    // Severity bar
    const sev = severitySummary;
    const parts = [];
    if (sev.critical > 0)
        parts.push(`${red(`● ${sev.critical} critical`, true)}`);
    if (sev.high > 0)
        parts.push(`${red(`● ${sev.high} high`)}`);
    if (sev.medium > 0)
        parts.push(`${yellow(`● ${sev.medium} medium`)}`);
    if (sev.low > 0)
        parts.push(`${blue(`● ${sev.low} low`)}`);
    if (parts.length === 0) {
        lines.push(`${green("✓")} ${green("No vulnerabilities found.", true)} ${dim("Your code looks clean!")}`);
    }
    else {
        lines.push(`  ${dim("Results:")} ${parts.join("  ")}`);
    }
    lines.push("");
    // Detailed findings
    if (results.length > 0) {
        lines.push(`${C.bold}${C.white}🔍 Findings${C.reset}`);
        lines.push(`${dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")}`);
        for (const result of results) {
            const shortFile = result.file.replace(target, "").replace(/^\//, "");
            lines.push(`\n  ${C.bold}${shortFile}${C.reset} ${dim(`(${result.language})`)}`);
            for (const finding of result.findings) {
                const sevColor = finding.severity === "critical" ? red : finding.severity === "high" ? red : finding.severity === "medium" ? yellow : blue;
                const sevLabel = finding.severity.toUpperCase();
                lines.push(`    ${sevColor(`[${sevLabel}]`, true)} ${finding.title}`);
                const loc = finding.line ? `${cyan(`line ${finding.line}`)}` : "";
                if (loc)
                    lines.push(`      ${dim("Location:")} ${loc}`);
                if (verbose) {
                    lines.push(`      ${dim("What:")} ${finding.description}`);
                    lines.push(`      ${dim("Fix:")} ${finding.recommendation}`);
                }
                if (fix && finding.suggestedFix) {
                    lines.push(`      ${green("💡 Fix:")} ${finding.suggestedFix}`);
                }
                if (verbose && finding.snippet) {
                    lines.push(`      ${dim("Code:")} ${finding.snippet.slice(0, 100)}`);
                }
            }
        }
        lines.push("");
    }
    // Recommendations footer
    lines.push(`${C.bold}${C.white}📖 Next Steps${C.reset}`);
    lines.push(`${dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")}`);
    if (severitySummary.critical + severitySummary.high + severitySummary.medium + severitySummary.low > 0) {
        lines.push(`  ${dim("• Review the findings above and follow the fix suggestions.")}`);
        lines.push(`  ${dim("• Run with")} ${cyan("--verbose")} ${dim("to see detailed explanations.")}`);
        lines.push(`  ${dim("• Generate a report:")} ${cyan("vulnpilot scan --html .")}`);
    }
    else {
        lines.push(`  ${dim("• No issues found — your code looks secure!")}`);
        lines.push(`  ${dim("• Run regularly to catch new vulnerabilities early.")}`);
    }
    lines.push(`  ${dim("• Need help? Visit the docs or run")} ${cyan("vulnpilot help")}`);
    lines.push("");
    return lines.join("\n");
}
// ── Scan command ────────────────────────────────────────────────────────────
function runScan(options) {
    const target = options.target ?? ".";
    const absoluteTarget = resolveInputPath(target);
    // Friendly error for missing path
    if (!fs.existsSync(absoluteTarget)) {
        console.error(`\n${red("✗", true)} Project folder not found.\n`);
        console.error(`  ${dim("The path you provided does not exist:")}`);
        console.error(`  ${red(absoluteTarget)}\n`);
        console.error(`  ${dim("Make sure the folder name is correct, then try again.")}`);
        console.error(`  ${dim("Example:")} ${cyan("vulnpilot scan ./my-project")}`);
        console.error(`  ${dim("         ")} ${cyan("vulnpilot scan .")}   ${dim("(scan current folder)")}`);
        console.error("");
        process.exit(1);
    }
    // Check if path is a file or directory
    const stat = fs.statSync(absoluteTarget);
    if (!stat.isDirectory() && !stat.isFile()) {
        console.error(`\n${red("✗", true)} Invalid path.\n`);
        console.error(`  ${dim("The path provided is neither a file nor a directory.")}`);
        console.error(`  ${red(absoluteTarget)}\n`);
        process.exit(1);
    }
    // Check for permission issues
    try {
        fs.accessSync(absoluteTarget, fs.constants.R_OK);
    }
    catch {
        console.error(`\n${red("✗", true)} Permission denied.\n`);
        console.error(`  ${dim("VulnPilot does not have permission to read this location:")}`);
        console.error(`  ${red(absoluteTarget)}\n`);
        console.error(`  ${dim("Try running with the appropriate permissions or choose a different folder.")}`);
        console.error("");
        process.exit(1);
    }
    // Start scan
    console.log(`\n${C.bold}${C.white}🛡️  VulnPilot AI Scanner${C.reset}`);
    console.log(`${dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")}`);
    const started = perf_hooks_1.performance.now();
    const analysisService = new static_analysis_service_1.StaticAnalysisService();
    const scanner = new project_scanner_service_1.ProjectScannerService(analysisService);
    // Progress simulation
    let discoveredFiles;
    try {
        discoveredFiles = scanner.getScannableFiles(absoluteTarget);
    }
    catch (err) {
        console.error(`\n${red("✗", true)} Could not scan the project.\n`);
        console.error(`  ${dim("An error occurred while reading the project files.")}`);
        console.error(`  ${dim("This might happen if the folder contains unusual file types or is very large.")}`);
        console.error(`  ${dim("Try scanning a specific subfolder instead.")}`);
        console.error("");
        process.exit(1);
    }
    const filesScanned = discoveredFiles.length;
    if (filesScanned === 0) {
        console.log(`\n${yellow("⚠", true)} No supported source files found.\n`);
        console.log(`  ${dim("VulnPilot scans these file types:")}`);
        console.log(`  ${cyan(".js .ts .tsx .jsx .py .java .go .php .cs .rs .c .cpp .kt .swift")}\n`);
        console.log(`  ${dim("The path you provided doesn't contain any of these.")}`);
        console.log(`  ${dim("Try pointing VulnPilot at a source code directory.")}`);
        console.log(`  ${dim("Example:")} ${cyan("vulnpilot scan ./src")}`);
        console.log("");
        return;
    }
    // Show detected languages
    const langCount = new Map();
    for (const file of discoveredFiles) {
        const ext = path.extname(file).toLowerCase();
        langCount.set(ext, (langCount.get(ext) ?? 0) + 1);
    }
    console.log(`  ${green("✓")} ${dim("Found")} ${cyan(String(filesScanned))} ${dim("source files to scan")}`);
    for (const [ext, count] of langCount) {
        console.log(`  ${green("✓")} ${dim("Detected:")} ${cyan(ext)} ${dim(`(${count} files)`)}`);
    }
    console.log(`  ${green("✓")} ${dim("Running security analysis...")}`);
    // Perform scan
    let results;
    try {
        results = scanner.scan(absoluteTarget);
    }
    catch (err) {
        console.error(`\n${red("✗", true)} Scan failed.\n`);
        console.error(`  ${dim("An unexpected error occurred during the scan.")}`);
        console.error(`  ${dim("This is likely a bug — please report it.")}`);
        console.error(`  ${red(err.message ?? String(err))}\n`);
        process.exit(1);
    }
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
// ── Doctor command ──────────────────────────────────────────────────────────
function runDoctor() {
    console.log(`\n${C.bold}${C.white}🩺 VulnPilot Health Check${C.reset}`);
    console.log(`${dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")}`);
    let allGood = true;
    // Check Node.js
    const nodeVersion = process.version;
    console.log(`  ${green("✓")} ${dim("Node.js:")} ${cyan(nodeVersion)}`);
    if (parseInt(nodeVersion.slice(1)) < 18) {
        console.log(`  ${yellow("⚠")} ${dim("VulnPilot works best with Node.js 18 or newer.")}`);
        allGood = false;
    }
    // Check CLI binary
    const cliPath = process.argv[1];
    if (cliPath && fs.existsSync(cliPath)) {
        console.log(`  ${green("✓")} ${dim("CLI binary:")} ${cyan(cliPath)}`);
    }
    else {
        console.log(`  ${red("✗")} ${dim("CLI binary not found.")}`);
        allGood = false;
    }
    // Check static analysis engine
    try {
        const analysisService = new static_analysis_service_1.StaticAnalysisService();
        const testContent = "const x = 1;";
        analysisService.analyze(testContent, "typescript", "test.ts");
        console.log(`  ${green("✓")} ${dim("Analysis engine:")} ${cyan("Ready")}`);
    }
    catch {
        console.log(`  ${red("✗")} ${dim("Analysis engine:")} ${red("Failed to initialize")}`);
        allGood = false;
    }
    // Check config directory
    const configDir = getConfigDir();
    if (fs.existsSync(configDir)) {
        console.log(`  ${green("✓")} ${dim("Config directory:")} ${cyan(configDir)}`);
    }
    else {
        console.log(`  ${dim("  Config directory:")} ${dim("Not yet created (will be created on first run)")}`);
    }
    // Report formats
    console.log(`  ${green("✓")} ${dim("Report formats:")} ${cyan("Console, JSON, SARIF, HTML, Markdown")}`);
    console.log(`\n${allGood ? green("✓", true) : yellow("⚠", true)} ${allGood ? green("All checks passed!") : yellow("Some issues found")} ${dim("— VulnPilot is")} ${allGood ? green("ready to use") : yellow("partially ready")}.`);
    console.log(`${dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")}\n`);
}
// ── Config command ──────────────────────────────────────────────────────────
function runConfig() {
    console.log(`\n${C.bold}${C.white}⚙️  VulnPilot Configuration${C.reset}`);
    console.log(`${dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")}`);
    console.log(`  ${green("✓")} ${dim("Using default configuration")}`);
    console.log(`  ${dim("  No extra setup is required for basic scanning.")}`);
    const configDir = getConfigDir();
    if (fs.existsSync(configDir)) {
        console.log(`  ${dim("  Config directory:")} ${cyan(configDir)}`);
    }
    console.log(`  ${green("💡")} ${dim("To configure AI features, set")} ${cyan("GEMINI_API_KEY")} ${dim("in your environment.")}`);
    console.log(`${dim("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")}\n`);
}
// ── Main entry point ────────────────────────────────────────────────────────
function main() {
    const options = parseArgs(process.argv.slice(2));
    // Show welcome on first run
    if (isFirstRun() && options.command !== "help") {
        showWelcome();
        markFirstRunDone();
    }
    switch (options.command) {
        case "scan":
            runScan(options);
            break;
        case "version":
            console.log(`${green("✓")} ${version_1.CLI_NAME} ${cyan(version_1.CLI_VERSION)}`);
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
            console.error(`\n${red("✗", true)} Unknown command: ${cyan(process.argv[2] ?? "")}\n`);
            console.error(`  ${dim("Run")} ${cyan("vulnpilot help")} ${dim("to see available commands.")}\n`);
            process.exitCode = 1;
            break;
    }
}
main();
//# sourceMappingURL=cli.js.map