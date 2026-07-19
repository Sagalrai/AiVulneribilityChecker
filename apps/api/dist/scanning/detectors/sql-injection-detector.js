"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlInjectionDetector = void 0;
const ts = __importStar(require("typescript"));
const ast_utils_1 = require("../ast-utils");
class SqlInjectionDetector {
    name = "SqlInjectionDetector";
    detect(content, filePath, language) {
        if ((0, ast_utils_1.isDetectorImplementation)(filePath))
            return [];
        const sourceFile = (0, ast_utils_1.parseSource)(content);
        if (!sourceFile)
            return [];
        const findings = [];
        const seen = new Set();
        const visit = (node) => {
            if (ts.isCallExpression(node)) {
                const expression = node.expression.getText(sourceFile);
                const args = node.arguments.map(arg => arg.getText(sourceFile));
                const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
                const snippet = node.getText(sourceFile).trim();
                if ((expression.includes("query") || expression.includes("sql") || expression.includes("execute")) &&
                    args.some(arg => /req\.(query|body|params)|request\.(query|body|params)|params\[/.test(arg))) {
                    const key = `${filePath}:${line}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        findings.push({
                            id: "sql-injection-001",
                            title: "Potential SQL Injection",
                            severity: "high",
                            confidence: 0.92,
                            description: "A database query is built with request-derived values without a clear parameterized path.",
                            attackScenario: "An attacker can alter the query logic through request parameters and access or modify data unexpectedly.",
                            impact: "Unauthorized data access, data manipulation, or database compromise.",
                            recommendation: "Use parameterized queries or ORM APIs that bind values safely.",
                            owasp: "A03:2021-Injection",
                            cwe: "CWE-89",
                            file: filePath,
                            line,
                            snippet,
                            suggestedFix: "Replace string-built SQL with prepared statements or parameterized ORM calls.",
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
exports.SqlInjectionDetector = SqlInjectionDetector;
//# sourceMappingURL=sql-injection-detector.js.map