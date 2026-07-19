# VulnPilot AI Beginner's Guide 🛡️

Welcome to VulnPilot! This guide will help you install VulnPilot and run your first security scan — even if you've never used a security tool before.

---

## 📋 What You'll Learn

- [What is VulnPilot?](#what-is-vulnpilot)
- [Installation](#installation)
- [Your First Scan](#your-first-scan)
- [Understanding the Results](#understanding-the-results)
- [Common Commands](#common-commands)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

---

## What is VulnPilot?

VulnPilot is a tool that looks at your code and finds security problems.

Think of it like a spell-checker, but for security:

- **Spell-checker** finds typos in your writing
- **VulnPilot** finds vulnerabilities in your code

It checks for things like:

- **SQL Injection** — When someone could mess with your database
- **Cross-Site Scripting (XSS)** — When someone could inject malicious code
- **Hardcoded Secrets** — When passwords or API keys are visible in your code
- **JWT Issues** — When authentication tokens aren't secure

And the best part? **You don't need to know anything about security to use it.**

---

## Installation

### Step 1: Check if you have Node.js

Open your terminal and type:

```bash
node --version
```

If you see something like `v18.x.x` or `v20.x.x` or higher, you're good! Skip to Step 2.

If you see `command not found` or nothing, you need to install Node.js first.

### Step 2: Install Node.js (if needed)

1. Go to **[https://nodejs.org](https://nodejs.org)**
2. Click the big green button that says **LTS** (Long Term Support)
3. Run the installer you just downloaded
4. Follow the installation steps (just click "Next" a bunch of times)
5. **Restart your terminal** (close it and open it again)

### Step 3: Install VulnPilot

In your terminal, type:

```bash
npm install -g vulnpilot-ai
```

This downloads VulnPilot and makes it available as a command.

> **What does `-g` mean?** It stands for "global" — it makes VulnPilot available everywhere on your computer.

### Step 4: Verify the installation

```bash
vulnpilot doctor
```

You should see a health check report showing everything is working.

---

## Your First Scan

### Step 1: Open your terminal

- **Windows**: Press `Windows Key`, type `cmd`, press Enter
- **Mac**: Press `Cmd + Space`, type `Terminal`, press Enter
- **Linux**: Press `Ctrl + Alt + T`

### Step 2: Navigate to your project

Use the `cd` command to go to your project folder:

```bash
cd /path/to/your/project
```

> **Tip:** You can type `cd ` (with a space at the end) and then drag your project folder into the terminal window. The path will be filled in automatically!

### Step 3: Run the scan

```bash
vulnpilot scan .
```

The `.` means "scan the current folder."

### Step 4: Wait for results

VulnPilot will show you progress as it scans:

```
🛡️  VulnPilot AI Scanner
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓ Found 42 source files to scan
  ✓ Detected: .ts (30 files)
  ✓ Detected: .js (12 files)
  ✓ Running security analysis...
```

Then it will show you the results.

---

## Understanding the Results

### If no issues are found:

```
📋 Scan Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓ Scan completed in 150ms
    Target: /home/user/my-project
    Files scanned: 42

  ✓ No vulnerabilities found. Your code looks clean!
```

Great news! Your code doesn't have any obvious security issues.

### If issues are found:

```
📋 Scan Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓ Scan completed in 200ms
    Target: /home/user/my-project
    Files scanned: 42

  Results: ● 2 high  ● 5 medium

🔍 Findings
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  src/login.js (javascript)
    [HIGH] Potential SQL Injection
    [MEDIUM] JWT Handling May Be Weak
```

Each finding shows:

- **Severity** — How serious the issue is (HIGH, MEDIUM, LOW)
- **Title** — What the issue is
- **File** — Which file has the issue
- **Fix** — How to fix it (if you use `--fix`)

### Severity levels explained

| Severity | What it means |
|---|---|
| 🔥 **Critical** | Immediate security risk. Fix this first. |
| ⚠️ **High** | Serious vulnerability that should be fixed soon. |
| 🔶 **Medium** | Moderate risk. Should be addressed. |
| 🔵 **Low** | Minor issue. Good to fix but not urgent. |

---

## Common Commands

### Scan a specific folder

```bash
vulnpilot scan ./src
```

### Generate an HTML report

```bash
vulnpilot scan --html .
```

This creates a nice-looking report you can open in your browser.

### Save a report to a file

```bash
vulnpilot scan --html --output security-report.html
```

### See detailed explanations

```bash
vulnpilot scan --verbose .
```

### Include fix suggestions

```bash
vulnpilot scan --fix .
```

### Check your installation

```bash
vulnpilot doctor
```

### See all available commands

```bash
vulnpilot help
```

---

## Troubleshooting

### "vulnpilot: command not found"

**Problem:** Your terminal doesn't know about the `vulnpilot` command.

**Solution 1:** Install it globally:
```bash
npm install -g vulnpilot-ai
```

**Solution 2:** Use `npx` instead:
```bash
npx vulnpilot scan .
```

**Solution 3:** If you built from source, use the full path:
```bash
./bin/vulnpilot scan .
```

### "Project folder not found"

**Problem:** VulnPilot can't find the folder you specified.

**Solution:** Check that the folder exists:
```bash
ls          # List files in current folder
pwd         # Show current folder path
cd /correct/path   # Navigate to the right folder
```

### "No supported source files found"

**Problem:** The folder doesn't contain code files that VulnPilot can scan.

**Solution:** Make sure you're pointing at a folder with source code files (`.js`, `.ts`, `.py`, `.java`, etc.).

### "Permission denied"

**Problem:** VulnPilot can't read the folder.

**Solution:** Make sure you have permission to read the folder, or try a different folder.

### "Node.js is not installed"

**Problem:** Node.js is missing.

**Solution:** Download and install Node.js from [https://nodejs.org](https://nodejs.org).

### The scan is taking too long

**Problem:** Large projects can take a while to scan.

**Solution:** Try scanning a specific subfolder instead of the whole project:
```bash
vulnpilot scan ./src
```

---

## FAQ

### Do I need to know programming?

No! VulnPilot is designed for everyone. Just point it at your code.

### Do I need to configure anything?

No. It works out of the box. Just run `vulnpilot scan .`

### Is my code sent to the internet?

No. VulnPilot runs entirely on your computer. Your code never leaves your machine.

### Can I use it on any project?

VulnPilot works with these file types:
`.js` `.ts` `.tsx` `.jsx` `.py` `.java` `.go` `.php` `.cs` `.rs` `.c` `.cpp` `.kt` `.swift`

### How do I update VulnPilot?

```bash
npm update -g vulnpilot-ai
```

### How do I uninstall VulnPilot?

```bash
npm uninstall -g vulnpilot-ai
```

### Where can I get help?

- Open an issue on [GitHub](https://github.com/Sagalrai/AiVulneribilityChecker)
- Run `vulnpilot help` in your terminal
- Read the [README](../README.md)

---

## 🎉 You're Ready!

You've learned how to:

- ✅ Install VulnPilot
- ✅ Run your first security scan
- ✅ Understand the results
- ✅ Troubleshoot common issues

**Next steps:**

- Scan your projects regularly
- Fix the issues VulnPilot finds
- Share VulnPilot with your team

**Remember:** Security is a journey, not a destination. Every scan makes your code a little safer.

---

<div align="center">

**Secure Code. Ship Faster.**

</div>