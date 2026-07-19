import { DetectorRegistry } from "./detector-registry";
import { DetectorFinding } from "./detectors/base-detector";
import { ConfidenceEngine } from "./engine/confidence-engine";
import { DeduplicationEngine } from "./engine/deduplication-engine";

export type VulnerabilityFinding = DetectorFinding & {
    snippet: string;
    confidenceRationale?: string;
};

export class StaticAnalysisService {
    private readonly registry = new DetectorRegistry();
    private readonly confidenceEngine = new ConfidenceEngine();
    private readonly deduplicationEngine = new DeduplicationEngine();

    analyze(content: string, language: string, filePath = "unknown"): VulnerabilityFinding[] {
        const findings: VulnerabilityFinding[] = [];

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

        return this.deduplicationEngine.deduplicate(findings) as VulnerabilityFinding[];
    }
}
