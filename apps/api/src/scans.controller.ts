import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AIService } from "./ai/ai-factory";
import { StaticAnalysisService } from "./scanning/static-analysis.service";

class ScanRequestDto {
    code!: string;
    language!: string;
    filename?: string;
}

@Controller("api/scans")
export class ScansController {
    constructor(
        private readonly aiService: AIService,
        private readonly analysisService: StaticAnalysisService,
    ) {}

    @Post()
    async createScan(@Body() body: ScanRequestDto) {
        const findings = this.analysisService.analyze(body.code, body.language);
        const aiSummary = await this.aiService.generate(
            "Explain the security posture of the submitted code sample and propose remediation steps.",
            {
                language: body.language,
                filename: body.filename,
                findings,
            },
        );

        return {
            status: "queued",
            findings,
            aiSummary,
            message: "Scan request accepted. Static analysis completed and AI remediation guidance prepared.",
        };
    }

    @Get(":id")
    getScan(@Param("id") id: string) {
        return { id, status: "completed", message: `Scan ${id} is ready for review.` };
    }
}
