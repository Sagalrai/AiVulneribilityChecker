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
exports.JwtDetector = void 0;
const ts = __importStar(require("typescript"));
const ast_utils_1 = require("../ast-utils");
class JwtDetector {
    name = "JwtDetector";
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
                const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
                const snippet = node.getText(sourceFile).trim();
                const text = node.getText(sourceFile).toLowerCase();
                if (text.includes("jwt") &&
                    (text.includes("sign") || text.includes("verify")) &&
                    !text.includes("expiresin")) {
                    const key = `${filePath}:${line}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        findings.push({
                            id: "jwt-001",
                            title: "JWT Handling May Be Weak",
                            severity: "medium",
                            confidence: 0.8,
                            description: "JWT creation or verification appears to lack explicit expiration, issuer, or audience validation.",
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
exports.JwtDetector = JwtDetector;
//# sourceMappingURL=jwt-detector.js.map