import * as ts from "typescript";
import { isDetectorImplementation, parseSource } from "../ast-utils";
import { Detector, DetectorFinding } from "./base-detector";

export class SecretsDetector implements Detector {
    name = "SecretsDetector";

    detect(content: string, filePath: string, language: string): DetectorFinding[] {
        if (isDetectorImplementation(filePath)) return [];

        const sourceFile = parseSource(content);
        if (!sourceFile) return [];

        const findings: DetectorFinding[] = [];
        const seen = new Set<string>();

        const visit = (node: ts.Node) => {
            if (ts.isVariableDeclaration(node)) {
                const name = node.name.getText(sourceFile);
                const initializer = node.initializer?.getText(sourceFile) ?? "";
                const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
                const snippet = node.getText(sourceFile).trim();

                if (
                    (/api[_-]?key|token|secret|password/i.test(name) ||
                        /api[_-]?key|token|secret|password/i.test(initializer)) &&
                    /["'][^"']{8,}["']/.test(initializer)
                ) {
                    const key = `${filePath}:${line}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        findings.push({
                            id: "secret-001",
                            title: "Potential Hardcoded Secret",
                            severity: "high",
                            confidence: 0.9,
                            description:
                                "A variable that appears to hold a secret is initialized with a literal value.",
                            attackScenario: "An attacker who accesses the repository can reuse the embedded secret.",
                            impact: "Unauthorized access to services, APIs, or accounts.",
                            recommendation: "Move secrets to environment variables or a secure secret manager.",
                            owasp: "A02:2021-Cryptographic Failures",
                            cwe: "CWE-798",
                            file: filePath,
                            line,
                            snippet,
                            suggestedFix: "Load the value at runtime from a secure secret store.",
                            language,
                            ruleId: "SECRET-001",
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
