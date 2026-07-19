export type ConfidenceScore = {
    score: number;
    rationale: string;
};

export class ConfidenceEngine {
    score(rawScore: number, context: Array<string>): ConfidenceScore {
        const normalized = Math.max(0.1, Math.min(0.99, rawScore));
        const rationale = context.length > 0 ? context.join("; ") : "Baseline heuristic confidence";
        return {
            score: Number(normalized.toFixed(2)),
            rationale,
        };
    }
}
