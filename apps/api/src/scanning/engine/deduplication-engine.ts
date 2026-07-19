export class DeduplicationEngine {
    deduplicate<T extends { file?: string; line?: number; ruleId?: string }>(items: T[]): T[] {
        const seen = new Set<string>();
        const deduped: T[] = [];

        for (const item of items) {
            const key = `${item.file ?? "unknown"}:${item.line ?? 0}:${item.ruleId ?? "unknown"}`;
            if (seen.has(key)) continue;
            seen.add(key);
            deduped.push(item);
        }

        return deduped;
    }
}
