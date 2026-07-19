export type ConfidenceScore = {
    score: number;
    rationale: string;
};
export declare class ConfidenceEngine {
    score(rawScore: number, context: Array<string>): ConfidenceScore;
}
