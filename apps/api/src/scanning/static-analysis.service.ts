export type VulnerabilityFinding = {
    id: string;
    title: string;
    severity: "critical" | "high" | "medium" | "low";
    language: string;
    ruleId: string;
    snippet: string;
    recommendation: string;
    cwe?: string;
    owasp?: string[];
};

export class StaticAnalysisService {
    analyze(content: string, language: string): VulnerabilityFinding[] {
        const findings: VulnerabilityFinding[] = [];

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
