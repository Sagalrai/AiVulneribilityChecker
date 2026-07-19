export type AIRequest = {
    prompt: string;
    context?: Record<string, unknown>;
    model?: string;
};
export type AIResponse = {
    content: string;
    model?: string;
    metadata?: Record<string, unknown>;
};
export interface AIProvider {
    name: string;
    generate(request: AIRequest): Promise<AIResponse>;
}
