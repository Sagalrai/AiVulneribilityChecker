export type ProjectMetadata = {
    targetPath: string;
    languageCount: Record<string, number>;
    fileCount: number;
    totalBytes: number;
};
export declare class ProjectMetadataBuilder {
    build(targetPath: string, files: Array<{
        path: string;
        language: string;
        size: number;
    }>): ProjectMetadata;
}
