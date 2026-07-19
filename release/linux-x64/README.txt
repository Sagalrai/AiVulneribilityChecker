# VulnPilot AI

VulnPilot AI is a terminal-first CLI security tool for scanning source trees, surfacing likely vulnerabilities, and producing actionable reports.

## Highlights

- Fast CLI entrypoint for scanning files and folders
- AST-driven static analysis for common vulnerability classes
- Structured output for console, JSON, SARIF, HTML, and Markdown
- Lightweight workflow for local development and CI usage

## Installation

### Linux x64

1. Download the Linux release archive from the GitHub Releases page.
2. Extract the archive.
3. Run the binary directly:

```bash
./vulnpilot scan .
```

### Windows x64

1. Download the Windows release archive from the GitHub Releases page.
2. Extract the archive.
3. Run:

```powershell
./vulnpilot.exe scan .
```

If you prefer a local build, run:

```bash
npm install
npm run build
./bin/vulnpilot scan .
```

## Usage

```bash
vulnpilot scan .
vulnpilot scan src
vulnpilot scan project.js
vulnpilot version
vulnpilot doctor
vulnpilot help
vulnpilot config
```

## Examples

- `vulnpilot scan .`
- `vulnpilot scan src/`
- `vulnpilot scan --json .`
- `vulnpilot scan --sarif .`
- `vulnpilot scan --markdown .`

## Supported platforms

- Linux x64
- Windows x64
- macOS support can be added later by extending the release packaging scripts

## Troubleshooting

- If the binary is not executable on Linux, run `chmod +x vulnpilot`.
- If the command is not found, ensure the extracted directory is on your PATH or run the binary via its full path.
- If you are building locally, run `npm run build` before invoking the CLI.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the CLI-oriented architecture, scanning pipeline, and report strategy.
