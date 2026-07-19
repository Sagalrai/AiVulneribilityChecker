"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeduplicationEngine = void 0;
class DeduplicationEngine {
    deduplicate(items) {
        const seen = new Set();
        const deduped = [];
        for (const item of items) {
            const key = `${item.file ?? "unknown"}:${item.line ?? 0}:${item.ruleId ?? "unknown"}`;
            if (seen.has(key))
                continue;
            seen.add(key);
            deduped.push(item);
        }
        return deduped;
    }
}
exports.DeduplicationEngine = DeduplicationEngine;
//# sourceMappingURL=deduplication-engine.js.map