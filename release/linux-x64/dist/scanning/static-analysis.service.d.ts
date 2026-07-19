import { DetectorFinding } from "./detectors/base-detector";
export type VulnerabilityFinding = DetectorFinding & {
    snippet: string;
    confidenceRationale?: string;
};
export declare class StaticAnalysisService {
    private readonly registry;
    private readonly confidenceEngine;
    private readonly deduplicationEngine;
    analyze(content: string, language: string, filePath?: string): VulnerabilityFinding[];
}
