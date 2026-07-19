export type DiscoveredFile = {
    path: string;
    language: string;
    size: number;
};
export declare class ProjectDiscovery {
    private readonly ignoredDirectories;
    discover(targetPath: string): DiscoveredFile[];
    private walk;
    private toDiscoveredFile;
    private shouldInclude;
    private detectLanguage;
}
