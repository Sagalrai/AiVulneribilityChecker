# VulnPilot AI

VulnPilot AI is an AI-assisted application security platform for discovering, explaining, prioritizing, patching, and learning from vulnerabilities before deployment.

## Highlights

- Next.js + TypeScript dashboard with a premium SaaS shell
- NestJS API with a provider-abstraction layer for AI
- Gemini API as the default AI provider
- Static analysis pipeline for security findings and remediation guidance
- Prisma-backed domain model for projects, repositories, scans, findings, and reports

## Quick start

1. Install dependencies with `npm install --legacy-peer-deps`
2. Copy [.env.example](.env.example) to `.env` and provide values
3. Start the API: `npm run dev:api`
4. Start the web app: `npm run dev:web`

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the product blueprint, API surface, deployment approach, and roadmap.
# AiVulneribilityChecker
