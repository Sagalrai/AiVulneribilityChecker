import * as fs from "fs";
import { ProjectDiscovery } from "./engine/project-discovery";
import { ProjectMetadataBuilder } from "./engine/project-metadata-builder";
import { StaticAnalysisService } from "./static-analysis.service";

export type ProjectScanResult = {
    file: string;
    language: string;
    findings: ReturnType<StaticAnalysisService["analyze"]>;
};

export class ProjectScannerService {
    private readonly discovery = new ProjectDiscovery();
    private readonly metadataBuilder = new ProjectMetadataBuilder();

    constructor(private readonly analysisService: StaticAnalysisService) {}

    public getScannableFiles(targetPath: string): string[] {
        return this.discovery.discover(targetPath).map(file => file.path);
    }

    scan(targetPath: string): ProjectScanResult[] {
        const discoveredFiles = this.discovery.discover(targetPath);
        const metadata = this.metadataBuilder.build(targetPath, discoveredFiles);
        const results: ProjectScanResult[] = [];

        for (const file of discoveredFiles) {
            const content = fs.readFileSync(file.path, "utf8");
            const findings = this.analysisService.analyze(content, file.language, file.path);
            if (findings.length > 0) {
                results.push({ file: file.path, language: file.language, findings });
            }
        }

        return results;
    }
}
