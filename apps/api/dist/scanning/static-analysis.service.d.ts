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
export declare class StaticAnalysisService {
    analyze(content: string, language: string): VulnerabilityFinding[];
}
