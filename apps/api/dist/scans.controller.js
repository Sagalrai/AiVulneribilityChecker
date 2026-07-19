"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScansController = void 0;
const common_1 = require("@nestjs/common");
const ai_factory_1 = require("./ai/ai-factory");
const static_analysis_service_1 = require("./scanning/static-analysis.service");
class ScanRequestDto {
    code;
    language;
    filename;
}
let ScansController = class ScansController {
    aiService;
    analysisService;
    constructor(aiService, analysisService) {
        this.aiService = aiService;
        this.analysisService = analysisService;
    }
    async createScan(body) {
        const findings = this.analysisService.analyze(body.code, body.language);
        const aiSummary = await this.aiService.generate("Explain the security posture of the submitted code sample and propose remediation steps.", {
            language: body.language,
            filename: body.filename,
            findings,
        });
        return {
            status: "queued",
            findings,
            aiSummary,
            message: "Scan request accepted. Static analysis completed and AI remediation guidance prepared.",
        };
    }
    getScan(id) {
        return { id, status: "completed", message: `Scan ${id} is ready for review.` };
    }
};
exports.ScansController = ScansController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ScanRequestDto]),
    __metadata("design:returntype", Promise)
], ScansController.prototype, "createScan", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScansController.prototype, "getScan", null);
exports.ScansController = ScansController = __decorate([
    (0, common_1.Controller)("api/scans"),
    __metadata("design:paramtypes", [ai_factory_1.AIService,
        static_analysis_service_1.StaticAnalysisService])
], ScansController);
//# sourceMappingURL=scans.controller.js.map