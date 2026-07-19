export type ProjectMetadata = {
    targetPath: string;
    languageCount: Record<string, number>;
    fileCount: number;
    totalBytes: number;
};

export class ProjectMetadataBuilder {
    build(targetPath: string, files: Array<{ path: string; language: string; size: number }>): ProjectMetadata {
        const languageCount = files.reduce<Record<string, number>>((acc, file) => {
            acc[file.language] = (acc[file.language] ?? 0) + 1;
            return acc;
        }, {});

        return {
            targetPath,
            languageCount,
            fileCount: files.length,
            totalBytes: files.reduce((sum, file) => sum + file.size, 0),
        };
    }
}
