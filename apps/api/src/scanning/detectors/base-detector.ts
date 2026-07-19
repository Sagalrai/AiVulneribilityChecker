export type DetectorFinding = {
    id: string;
    title: string;
    severity: "critical" | "high" | "medium" | "low";
    confidence: number;
    description: string;
    attackScenario: string;
    impact: string;
    recommendation: string;
    owasp: string;
    cwe: string;
    file?: string;
    line?: number;
    snippet?: string;
    suggestedFix?: string;
    language: string;
    ruleId: string;
};

export interface Detector {
    name: string;
    detect(content: string, filePath: string, language: string): DetectorFinding[];
}
