"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
class OpenAIProvider {
    name = "openai";
    async generate(request) {
        return {
            content: `OpenAI-style remediation guidance for: ${request.prompt}`,
            model: request.model ?? "gpt-4o-mini",
            metadata: { provider: "openai" },
        };
    }
}
exports.OpenAIProvider = OpenAIProvider;
//# sourceMappingURL=openai.provider.js.map