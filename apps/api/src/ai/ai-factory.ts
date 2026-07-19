import { AIProvider } from "./ai-provider.interface";
import { GeminiProvider } from "./gemini.provider";

export class AIService {
    constructor(private readonly provider: AIProvider = new GeminiProvider()) {}

    async generate(prompt: string, context?: Record<string, unknown>) {
        return this.provider.generate({ prompt, context });
    }
}
