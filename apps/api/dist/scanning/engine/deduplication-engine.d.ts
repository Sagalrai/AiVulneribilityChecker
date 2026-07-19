export declare class DeduplicationEngine {
    deduplicate<T extends {
        file?: string;
        line?: number;
        ruleId?: string;
    }>(items: T[]): T[];
}
