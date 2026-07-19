"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticAnalysisService = void 0;
const detector_registry_1 = require("./detector-registry");
const confidence_engine_1 = require("./engine/confidence-engine");
const deduplication_engine_1 = require("./engine/deduplication-engine");
class StaticAnalysisService {
    registry = new detector_registry_1.DetectorRegistry();
    confidenceEngine = new confidence_engine_1.ConfidenceEngine();
    deduplicationEngine = new deduplication_engine_1.DeduplicationEngine();
    analyze(content, language, filePath = "unknown") {
        const findings = [];
        for (const detector of this.registry.getDetectors()) {
            const detected = detector.detect(content, filePath, language);
            for (const finding of detected) {
                const confidence = this.confidenceEngine.score(finding.confidence, [
                    finding.ruleId,
                    filePath,
                    language,
                ]);
                findings.push({
                    ...finding,
                    confidence: confidence.score,
                    confidenceRationale: confidence.rationale,
                    snippet: finding.snippet ?? content.slice(0, 180),
                });
            }
        }
        return this.deduplicationEngine.deduplicate(findings);
    }
}
exports.StaticAnalysisService = StaticAnalysisService;
//# sourceMappingURL=static-analysis.service.js.map