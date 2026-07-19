"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticAnalysisService = void 0;
class StaticAnalysisService {
    analyze(content, language) {
        const findings = [];
        if (content.includes("SELECT") && content.includes("request.query")) {
            findings.push({
                id: "sql-injection-001",
                title: "Potential SQL Injection",
                severity: "high",
                language,
                ruleId: "SQLI-001",
                snippet: content.slice(0, 180),
                recommendation: "Parameterize queries and avoid string-based query construction.",
                cwe: "CWE-89",
                owasp: ["A03:2021-Injection"],
            });
        }
        if (content.includes("innerHTML") || content.includes("document.write")) {
            findings.push({
                id: "xss-001",
                title: "Potential Cross-Site Scripting",
                severity: "high",
                language,
                ruleId: "XSS-001",
                snippet: content.slice(0, 180),
                recommendation: "Use safe DOM APIs and escape untrusted content.",
                cwe: "CWE-79",
                owasp: ["A03:2021-Injection"],
            });
        }
        return findings;
    }
}
exports.StaticAnalysisService = StaticAnalysisService;
//# sourceMappingURL=static-analysis.service.js.map