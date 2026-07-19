"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfidenceEngine = void 0;
class ConfidenceEngine {
    score(rawScore, context) {
        const normalized = Math.max(0.1, Math.min(0.99, rawScore));
        const rationale = context.length > 0 ? context.join("; ") : "Baseline heuristic confidence";
        return {
            score: Number(normalized.toFixed(2)),
            rationale,
        };
    }
}
exports.ConfidenceEngine = ConfidenceEngine;
//# sourceMappingURL=confidence-engine.js.map