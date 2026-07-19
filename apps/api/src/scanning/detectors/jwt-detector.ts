import * as ts from "typescript";
import { isDetectorImplementation, parseSource } from "../ast-utils";
import { Detector, DetectorFinding } from "./base-detector";

export class JwtDetector implements Detector {
    name = "JwtDetector";

    detect(content: string, filePath: string, language: string): DetectorFinding[] {
        if (isDetectorImplementation(filePath)) return [];

        const sourceFile = parseSource(content);
        if (!sourceFile) return [];

        const findings: DetectorFinding[] = [];
        const seen = new Set<string>();

        const visit = (node: ts.Node) => {
            if (ts.isCallExpression(node)) {
                const expression = node.expression.getText(sourceFile);
                const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
                const snippet = node.getText(sourceFile).trim();
                const text = node.getText(sourceFile).toLowerCase();

                if (
                    text.includes("jwt") &&
                    (text.includes("sign") || text.includes("verify")) &&
                    !text.includes("expiresin")
                ) {
                    const key = `${filePath}:${line}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        findings.push({
                            id: "jwt-001",
                            title: "JWT Handling May Be Weak",
                            severity: "medium",
                            confidence: 0.8,
                            description:
                                "JWT creation or verification appears to lack explicit expiration, issuer, or audience validation.",
                            attackScenario: "An attacker may replay or forge tokens if validation is incomplete.",
                            impact: "Authentication bypass or privilege escalation.",
                            recommendation: "Validate issuer, audience, expiration, and use strong signing algorithms.",
                            owasp: "A07:2021-Identification and Authentication Failures",
                            cwe: "CWE-287",
                            file: filePath,
                            line,
                            snippet,
                            suggestedFix: "Enforce verified claims and short token lifetimes.",
                            language,
                            ruleId: "JWT-001",
                        });
                    }
                }
            }

            ts.forEachChild(node, visit);
        };

        visit(sourceFile);
        return findings;
    }
}
