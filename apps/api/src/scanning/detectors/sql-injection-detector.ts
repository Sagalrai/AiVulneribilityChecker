import * as ts from "typescript";
import { isDetectorImplementation, parseSource } from "../ast-utils";
import { Detector, DetectorFinding } from "./base-detector";

export class SqlInjectionDetector implements Detector {
    name = "SqlInjectionDetector";

    detect(content: string, filePath: string, language: string): DetectorFinding[] {
        if (isDetectorImplementation(filePath)) return [];

        const sourceFile = parseSource(content);
        if (!sourceFile) return [];

        const findings: DetectorFinding[] = [];
        const seen = new Set<string>();

        const visit = (node: ts.Node) => {
            if (ts.isCallExpression(node)) {
                const expression = node.expression.getText(sourceFile);
                const args = node.arguments.map(arg => arg.getText(sourceFile));
                const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
                const snippet = node.getText(sourceFile).trim();

                if (
                    (expression.includes("query") || expression.includes("sql") || expression.includes("execute")) &&
                    args.some(arg => /req\.(query|body|params)|request\.(query|body|params)|params\[/.test(arg))
                ) {
                    const key = `${filePath}:${line}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        findings.push({
                            id: "sql-injection-001",
                            title: "Potential SQL Injection",
                            severity: "high",
                            confidence: 0.92,
                            description:
                                "A database query is built with request-derived values without a clear parameterized path.",
                            attackScenario:
                                "An attacker can alter the query logic through request parameters and access or modify data unexpectedly.",
                            impact: "Unauthorized data access, data manipulation, or database compromise.",
                            recommendation: "Use parameterized queries or ORM APIs that bind values safely.",
                            owasp: "A03:2021-Injection",
                            cwe: "CWE-89",
                            file: filePath,
                            line,
                            snippet,
                            suggestedFix:
                                "Replace string-built SQL with prepared statements or parameterized ORM calls.",
                            language,
                            ruleId: "SQLI-001",
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
