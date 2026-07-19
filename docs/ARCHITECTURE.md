# VulnPilot AI Architecture Blueprint

## 1. Product Vision

VulnPilot AI is an AI-assisted application security platform that helps engineering teams discover, explain, prioritize, patch, and learn from vulnerabilities before deployment.

## 2. Architectural Principles

- Clean Architecture with dependency inversion
- Provider abstraction for AI backends
- Static analysis first; AI for explanation and remediation
- Security by design with policy enforcement and auditability
- Enterprise-grade observability and extensibility

## 3. System Overview

- Frontend: Next.js dashboard for security operations, scans, and AI mentorship
- Backend: NestJS API for orchestration, scanning, auth, and report generation
- Data Layer: PostgreSQL + Prisma for core domain models
- AI Layer: provider abstraction with Gemini as default implementation
- Scanning Layer: repository ingestion, framework detection, static analysis, rule engine, and report assembly

## 4. Core Domain Model

- Organization
- User
- Project
- Repository
- ScanRun
- VulnerabilityFinding
- PatchSuggestion
- AIConversation
- Report
- AuditLog

## 5. AI Provider Abstraction

```text
AIProvider
├── GeminiProvider
├── OpenAIProvider
├── ClaudeProvider
└── LocalProvider
```

All AI traffic flows through the interface, never directly through business logic.

## 6. Scanning Pipeline

1. Repository upload
2. Language detection
3. Framework detection
4. Dependency scan
5. AST parsing
6. Static analysis engine
7. Rule engine
8. OWASP/CWE mapping
9. Vulnerable snippet extraction
10. Gemini explanation and patch generation
11. Report assembly and dashboard updates

## 7. API Surface

- GET /health
- POST /api/projects
- GET /api/projects/:id
- POST /api/scans
- GET /api/scans/:id
- POST /api/mentor/chat
- GET /api/reports/:id

## 8. Deployment Architecture

- Web app hosted on AWS ECS or Vercel
- API on ECS/Kubernetes
- PostgreSQL on managed RDS
- Redis for queues and caching
- Object storage for uploads and reports
- OpenTelemetry + Prometheus + Grafana for observability

## 9. Security Architecture

- Auth.js or Supabase Auth
- RBAC for org, project, and repository roles
- Rate limiting and security headers
- Secret scanning and least privilege access
- Audit logging for all critical actions

## 10. Implementation Roadmap

Phase 1: monorepo scaffolding, architecture docs, AI provider abstraction, scan engine foundation, premium dashboard shell
Phase 2: repository ingestion, rule engine expansion, report generation, mentorship chat, RBAC
Phase 3: CI/CD, Supabase integration, queue processing, enterprise reporting, compliance workflows
