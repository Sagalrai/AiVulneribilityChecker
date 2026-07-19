import { AIProvider, AIRequest, AIResponse } from "./ai-provider.interface";

export class OpenAIProvider implements AIProvider {
    name = "openai";

    async generate(request: AIRequest): Promise<AIResponse> {
        return {
            content: `OpenAI-style remediation guidance for: ${request.prompt}`,
            model: request.model ?? "gpt-4o-mini",
            metadata: { provider: "openai" },
        };
    }
}
