"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const gemini_provider_1 = require("./gemini.provider");
class AIService {
    provider;
    constructor(provider = new gemini_provider_1.GeminiProvider()) {
        this.provider = provider;
    }
    async generate(prompt, context) {
        return this.provider.generate({ prompt, context });
    }
}
exports.AIService = AIService;
//# sourceMappingURL=ai-factory.js.map