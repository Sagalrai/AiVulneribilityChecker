<div align="center">

# VulnPilot AI 🛡️

### Your AI-Powered Security Scanner

**Find security vulnerabilities in your code — no experience needed.**

</div>

---

## ⚡ Quick Start

### 1. Install Node.js

VulnPilot needs **Node.js** to run. If you don't have it:

1. Go to **[https://nodejs.org](https://nodejs.org)**
2. Download the **LTS** version (the one on the left)
3. Run the installer
4. Restart your terminal

> **Already have Node.js?** Run `node --version` to check. You need version 18 or newer.

### 2. Install VulnPilot

Open your terminal and run:

```bash
npm install -g vulnpilot-ai
```

> **What does this do?** It downloads VulnPilot and makes it available as a command.

### 3. Run Your First Scan

```bash
vulnpilot scan .
```

That's it! VulnPilot will scan your current project and show you any security issues it finds.

---

## 📖 First Scan Tutorial

Let's walk through your first scan step by step.

### Step 1: Open Your Terminal

- **Windows**: Search for "Command Prompt" or "PowerShell"
- **Mac**: Search for "Terminal"
- **Linux**: Open your terminal application

### Step 2: Go to Your Project

Type `cd` followed by the path to your project:

```bash
cd /path/to/your/project
```

> **Tip:** You can also drag and drop a folder into the terminal to paste its path.

### Step 3: Run the Scan

```bash
vulnpilot scan .
```

The `.` means "scan the current folder."

### What You'll See

```
🛡️  VulnPilot AI Scanner
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓ Found 42 source files to scan
  ✓ Detected: .ts (30 files)
  ✓ Detected: .js (12 files)
  ✓ Running security analysis...

📋 Scan Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓ Scan completed in 150ms
    Target: /home/user/my-project
    Files scanned: 42

  Results: ● 2 high  ● 5 medium

🔍 Findings
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  src/login.js (javascript)
    [HIGH] Potential SQL Injection
    [MEDIUM] JWT Handling May Be Weak

📖 Next Steps
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Review the findings above and follow the fix suggestions.
  • Run with --verbose to see detailed explanations.
  • Generate a report: vulnpilot scan --html .
```

---

## 🎯 Commands

| Command | What it does |
|---|---|
| `vulnpilot scan .` | Scan the current folder for vulnerabilities |
| `vulnpilot scan ./src` | Scan a specific folder |
| `vulnpilot help` | Show available commands and options |
| `vulnpilot version` | Show the installed version |
| `vulnpilot doctor` | Check if everything is set up correctly |

### Options

Add these to your scan command:

| Option | What it does |
|---|---|
| `--json` | Get results in JSON format (for other tools) |
| `--html` | Generate a nice HTML report |
| `--markdown` | Generate a Markdown report |
| `--verbose` | Show detailed explanations for each finding |
| `--fix` | Include fix suggestions |
| `--output report.html` | Save the report to a file |

### Examples

```bash
# Scan the current folder
vulnpilot scan .

# Scan a specific folder
vulnpilot scan ./my-project

# Generate an HTML report
vulnpilot scan --html .

# Save report to a file
vulnpilot scan --html --output report.html

# See detailed information
vulnpilot scan --verbose .

# Get JSON output (for CI tools)
vulnpilot scan --json .
```

---

## ❓ Troubleshooting

### "Command not found: vulnpilot"

This means the `vulnpilot` command isn't available in your terminal.

**Solution:** Make sure you installed it globally:

```bash
npm install -g vulnpilot-ai
```

If it still doesn't work, try:

```bash
npx vulnpilot scan .
```

### "Project folder not found"

VulnPilot can't find the folder you specified.

**Solution:** Check that the folder exists and the path is correct:

```bash
# List files in current folder
ls

# Navigate to your project
cd path/to/your/project

# Then scan
vulnpilot scan .
```

### "No supported source files found"

VulnPilot scans these file types: `.js`, `.ts`, `.tsx`, `.jsx`, `.py`, `.java`, `.go`, `.php`, `.cs`, `.rs`, `.c`, `.cpp`, `.kt`, `.swift`

**Solution:** Make sure you're pointing VulnPilot at a folder that contains source code files.

### "Permission denied"

VulnPilot doesn't have permission to read the folder.

**Solution:** Make sure you have read access to the folder, or try a different folder.

### "Node.js is not installed"

VulnPilot requires Node.js to run.

**Solution:** Download and install Node.js from [https://nodejs.org](https://nodejs.org), then try again.

---

## 🩺 Health Check

Run this to check if VulnPilot is working correctly:

```bash
vulnpilot doctor
```

It will check:
- ✅ Node.js version
- ✅ CLI binary
- ✅ Analysis engine
- ✅ Report formats

---

## 📚 FAQ

### Do I need to know programming to use VulnPilot?

No! VulnPilot is designed for everyone. Just point it at your code and it will tell you if there are security issues.

### Do I need to configure anything?

No. VulnPilot works out of the box. Just run `vulnpilot scan .` and you're done.

### What does VulnPilot check for?

- **SQL Injection** — When user input can manipulate database queries
- **Cross-Site Scripting (XSS)** — When user input can inject scripts
- **Hardcoded Secrets** — When API keys or passwords are in your code
- **JWT Issues** — When authentication tokens aren't properly validated
- And more!

### Is my code sent anywhere?

No. VulnPilot runs entirely on your computer. Your code never leaves your machine.

### Can I use VulnPilot with CI/CD?

Yes! Use the `--json` or `--sarif` options to get machine-readable output that works with CI tools.

### How do I update VulnPilot?

```bash
npm update -g vulnpilot-ai
```

### I found a bug or have a suggestion

Open an issue on our [GitHub repository](https://github.com/Sagalrai/AiVulneribilityChecker).

---

## 🚀 For Experienced Users

### Install from source

```bash
git clone https://github.com/Sagalrai/AiVulneribilityChecker.git
cd AiVulneribilityChecker
npm install
npm run build
./bin/vulnpilot scan .
```

### Report formats

| Format | Command |
|---|---|
| Console (default) | `vulnpilot scan .` |
| JSON | `vulnpilot scan --json .` |
| HTML | `vulnpilot scan --html .` |
| Markdown | `vulnpilot scan --markdown .` |
| SARIF | `vulnpilot scan --sarif .` |

### AI-powered analysis

Set a Gemini API key to get AI-powered explanations:

```bash
export GEMINI_API_KEY=your-key-here
vulnpilot scan .
```

---

<div align="center">

**Secure Code. Ship Faster.**

Built with TypeScript, Node.js, and Artificial Intelligence.

</div>