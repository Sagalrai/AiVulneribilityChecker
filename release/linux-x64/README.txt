╔══════════════════════════════════════════╗
║  VulnPilot AI 🛡️                         ║
║  Your AI-powered security scanner        ║
╚══════════════════════════════════════════╝

Find security vulnerabilities in your code — no experience needed.

============================================
QUICK START
============================================

1. Make sure you have Node.js installed:

   Open a terminal and run:
     node --version

   If you see "command not found", download Node.js from:
     https://nodejs.org

2. Extract this archive to a folder on your computer.

3. Open a terminal in the extracted folder.

4. Run your first scan:

     ./vulnpilot scan .

   This will scan the current folder for security issues.

============================================
EXAMPLES
============================================

  Scan the current folder:
    ./vulnpilot scan .

  Scan a specific folder:
    ./vulnpilot scan ./my-project

  Generate an HTML report:
    ./vulnpilot scan --html .

  See all available commands:
    ./vulnpilot help

============================================
COMMANDS
============================================

  scan         Scan a project for security vulnerabilities
  help         Show this help message
  version      Show the installed version
  doctor       Check if everything is set up correctly

============================================
TROUBLESHOOTING
============================================

"Permission denied":
  Run: chmod +x vulnpilot

"vulnpilot: command not found":
  Run it from the extracted folder: ./vulnpilot scan .

"Node.js is not installed":
  Download from https://nodejs.org

Need more help?
  See the Beginner's Guide: docs/BEGINNER_GUIDE.md
  Visit: https://github.com/Sagalrai/AiVulneribilityChecker