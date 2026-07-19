# VulnPilot AI Architecture Blueprint

## 1. Product Vision

VulnPilot AI is a terminal-first security analysis tool that helps developers scan source trees, identify high-signal findings, and generate reports without leaving the command line.

## 2. Architectural Principles

- CLI-first interaction and automation readiness
- Static analysis first; AI for explanation and remediation when available
- Deterministic rule execution and low-noise reporting
- Security by design with policy enforcement and auditability
- Extensible detector and report pipeline

## 3. System Overview

- CLI entrypoint for scans, config, doctor, version, and help commands
- Static analysis engine for language-aware vulnerability detection
- Report generation for console, JSON, SARIF, HTML, and Markdown
- Optional AI-backed explanation and remediation support

## 4. Core Scanning Pipeline

1. Target discovery for files and folders
2. Language detection
3. Framework and dependency heuristics
4. AST parsing and rule execution
5. OWASP/CWE mapping
6. Vulnerable snippet extraction
7. Report assembly and CLI output

## 5. CLI Surface

- `vulnpilot scan .`
- `vulnpilot scan src/`
- `vulnpilot scan --json .`
- `vulnpilot scan --sarif .`
- `vulnpilot scan --html .`
- `vulnpilot doctor`
- `vulnpilot version`

## 6. Report Strategy

- Console output for interactive usage
- JSON for automation and CI integration
- SARIF for editor and CI tooling
- HTML and Markdown for human-readable review

## 7. Implementation Roadmap

Phase 1: CLI entrypoint, scan engine, detector refinement, report generation
Phase 2: richer rule coverage, configuration management, CI integration, fix suggestions
Phase 3: plugin expansion, policy enforcement, enterprise workflow support
