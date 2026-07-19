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
exports.SecretsDetector = void 0;
const ts = __importStar(require("typescript"));
const ast_utils_1 = require("../ast-utils");
class SecretsDetector {
    name = "SecretsDetector";
    detect(content, filePath, language) {
        if ((0, ast_utils_1.isDetectorImplementation)(filePath))
            return [];
        const sourceFile = (0, ast_utils_1.parseSource)(content);
        if (!sourceFile)
            return [];
        const findings = [];
        const seen = new Set();
        const visit = (node) => {
            if (ts.isVariableDeclaration(node)) {
                const name = node.name.getText(sourceFile);
                const initializer = node.initializer?.getText(sourceFile) ?? "";
                const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
                const snippet = node.getText(sourceFile).trim();
                if ((/api[_-]?key|token|secret|password/i.test(name) ||
                    /api[_-]?key|token|secret|password/i.test(initializer)) &&
                    /["'][^"']{8,}["']/.test(initializer)) {
                    const key = `${filePath}:${line}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        findings.push({
                            id: "secret-001",
                            title: "Potential Hardcoded Secret",
                            severity: "high",
                            confidence: 0.9,
                            description: "A variable that appears to hold a secret is initialized with a literal value.",
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
exports.SecretsDetector = SecretsDetector;
//# sourceMappingURL=secrets-detector.js.map