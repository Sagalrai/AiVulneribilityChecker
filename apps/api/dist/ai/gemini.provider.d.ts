import { AIProvider, AIRequest, AIResponse } from "./ai-provider.interface";
export declare class GeminiProvider implements AIProvider {
    name: string;
    generate(request: AIRequest): Promise<AIResponse>;
}
