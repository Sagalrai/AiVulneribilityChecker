import { AIService } from "./ai/ai-factory";
import { StaticAnalysisService } from "./scanning/static-analysis.service";
declare class ScanRequestDto {
    code: string;
    language: string;
    filename?: string;
}
export declare class ScansController {
    private readonly aiService;
    private readonly analysisService;
    constructor(aiService: AIService, analysisService: StaticAnalysisService);
    createScan(body: ScanRequestDto): Promise<{
        status: string;
        findings: import("./scanning/static-analysis.service").VulnerabilityFinding[];
        aiSummary: import("./ai/ai-provider.interface").AIResponse;
        message: string;
    }>;
    getScan(id: string): {
        id: string;
        status: string;
        message: string;
    };
}
export {};
