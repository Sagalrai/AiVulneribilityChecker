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
exports.XssDetector = void 0;
const ts = __importStar(require("typescript"));
const ast_utils_1 = require("../ast-utils");
class XssDetector {
    name = "XssDetector";
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
                const isUnsafeDomWrite = expression.includes("innerHTML") ||
                    expression.includes("write") ||
                    expression.includes("dangerouslySetInnerHTML");
                const hasUserData = node.arguments.some(arg => /req\.(query|body|params)|request\.(query|body|params)|params\[/.test(arg.getText(sourceFile)));
                if (isUnsafeDomWrite && hasUserData) {
                    const key = `${filePath}:${line}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        findings.push({
                            id: "xss-001",
                            title: "Potential Cross-Site Scripting",
                            severity: "high",
                            confidence: 0.88,
                            description: "User-controlled data is being inserted into a DOM sink without a clear sanitization step.",
                            attackScenario: "An attacker can inject script content and execute it in the browser of a victim user.",
                            impact: "Session theft, account takeover, or UI manipulation.",
                            recommendation: "Escape or sanitize user-controlled content before rendering it into the DOM.",
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
exports.XssDetector = XssDetector;
//# sourceMappingURL=xss-detector.js.map