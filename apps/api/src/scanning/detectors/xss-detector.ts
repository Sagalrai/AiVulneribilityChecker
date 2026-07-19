import * as ts from "typescript";
import { isDetectorImplementation, parseSource } from "../ast-utils";
import { Detector, DetectorFinding } from "./base-detector";

export class XssDetector implements Detector {
    name = "XssDetector";

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

                const isUnsafeDomWrite =
                    expression.includes("innerHTML") ||
                    expression.includes("write") ||
                    expression.includes("dangerouslySetInnerHTML");
                const hasUserData = node.arguments.some(arg =>
                    /req\.(query|body|params)|request\.(query|body|params)|params\[/.test(arg.getText(sourceFile)),
                );

                if (isUnsafeDomWrite && hasUserData) {
                    const key = `${filePath}:${line}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        findings.push({
                            id: "xss-001",
                            title: "Potential Cross-Site Scripting",
                            severity: "high",
                            confidence: 0.88,
                            description:
                                "User-controlled data is being inserted into a DOM sink without a clear sanitization step.",
                            attackScenario:
                                "An attacker can inject script content and execute it in the browser of a victim user.",
                            impact: "Session theft, account takeover, or UI manipulation.",
                            recommendation:
                                "Escape or sanitize user-controlled content before rendering it into the DOM.",
                            owasp: "A03:2021-Injection",
                            cwe: "CWE-79",
                            file: filePath,
                            line,
                            snippet,
                            suggestedFix: "Use safe rendering APIs or sanitize the data before insertion.",
                            language,
                            ruleId: "XSS-001",
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
