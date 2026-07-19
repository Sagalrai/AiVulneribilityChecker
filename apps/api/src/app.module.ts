import { Module } from "@nestjs/common";
import { AIService } from "./ai/ai-factory";
import { HealthController } from "./health.controller";
import { StaticAnalysisService } from "./scanning/static-analysis.service";
import { ScansController } from "./scans.controller";

@Module({
    imports: [],
    controllers: [HealthController, ScansController],
    providers: [AIService, StaticAnalysisService],
})
export class AppModule {}
