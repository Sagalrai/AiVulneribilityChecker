import { AIProvider } from "./ai-provider.interface";
export declare class AIService {
    private readonly provider;
    constructor(provider?: AIProvider);
    generate(prompt: string, context?: Record<string, unknown>): Promise<import("./ai-provider.interface").AIResponse>;
}
