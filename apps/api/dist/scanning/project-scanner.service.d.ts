import { StaticAnalysisService } from "./static-analysis.service";
export type ProjectScanResult = {
    file: string;
    language: string;
    findings: ReturnType<StaticAnalysisService["analyze"]>;
};
export declare class ProjectScannerService {
    private readonly analysisService;
    private readonly discovery;
    private readonly metadataBuilder;
    constructor(analysisService: StaticAnalysisService);
    getScannableFiles(targetPath: string): string[];
    scan(targetPath: string): ProjectScanResult[];
}
