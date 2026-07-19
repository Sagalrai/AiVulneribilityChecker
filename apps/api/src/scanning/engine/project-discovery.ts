import * as fs from "fs";
import * as path from "path";

export type DiscoveredFile = {
    path: string;
    language: string;
    size: number;
};

export class ProjectDiscovery {
    private readonly ignoredDirectories = new Set([
        "node_modules",
        "dist",
        "build",
        ".git",
        ".next",
        "coverage",
        "vendor",
        ".venv",
        "__pycache__",
    ]);

    discover(targetPath: string): DiscoveredFile[] {
        const absoluteTarget = path.resolve(targetPath);
        if (!fs.existsSync(absoluteTarget)) return [];
        const stat = fs.statSync(absoluteTarget);
        if (stat.isFile()) {
            return [this.toDiscoveredFile(absoluteTarget)];
        }

        const discovered: DiscoveredFile[] = [];
        this.walk(absoluteTarget, discovered);
        return discovered.filter(file => this.shouldInclude(file.path));
    }

    private walk(currentPath: string, collected: DiscoveredFile[]) {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
            if (entry.isDirectory()) {
                if (this.ignoredDirectories.has(entry.name)) continue;
                this.walk(fullPath, collected);
                continue;
            }

            if (entry.isFile()) {
                collected.push(this.toDiscoveredFile(fullPath));
            }
        }
    }

    private toDiscoveredFile(filePath: string): DiscoveredFile {
        return {
            path: filePath,
            language: this.detectLanguage(filePath),
            size: fs.statSync(filePath).size,
        };
    }

    private shouldInclude(filePath: string): boolean {
        const supportedExtensions = [
            ".js",
            ".ts",
            ".tsx",
            ".jsx",
            ".py",
            ".java",
            ".go",
            ".php",
            ".cs",
            ".rs",
            ".c",
            ".cpp",
            ".kt",
            ".swift",
        ];
        if (!supportedExtensions.includes(path.extname(filePath).toLowerCase())) return false;
        if (filePath.includes("/detectors/") || filePath.includes("\\detectors\\")) return false;
        if (filePath.endsWith("cli.ts")) return false;
        return true;
    }

    private detectLanguage(filePath: string): string {
        const ext = path.extname(filePath).toLowerCase();
        const map: Record<string, string> = {
            ".js": "javascript",
            ".jsx": "javascript",
            ".ts": "typescript",
            ".tsx": "typescript",
            ".py": "python",
            ".java": "java",
            ".go": "go",
            ".php": "php",
            ".cs": "csharp",
            ".rs": "rust",
            ".c": "c",
            ".cpp": "cpp",
            ".kt": "kotlin",
            ".swift": "swift",
        };
        return map[ext] ?? "unknown";
    }
}
