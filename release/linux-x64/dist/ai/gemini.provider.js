"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProvider = void 0;
class GeminiProvider {
    name = "gemini";
    async generate(request) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return {
                content: "Gemini API key is not configured. Configure GEMINI_API_KEY to enable AI-assisted remediation.",
                metadata: { fallback: true },
            };
        }
        const responseText = `Gemini would analyze the provided context for: ${request.prompt}`;
        return {
            content: responseText,
            model: request.model ?? "gemini-2.0-flash",
            metadata: { provider: "gemini", configured: true },
        };
    }
}
exports.GeminiProvider = GeminiProvider;
//# sourceMappingURL=gemini.provider.js.map