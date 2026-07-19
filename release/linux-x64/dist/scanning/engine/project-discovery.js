"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectDiscovery = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ProjectDiscovery {
    ignoredDirectories = new Set([
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
    discover(targetPath) {
        const absoluteTarget = path.resolve(targetPath);
        if (!fs.existsSync(absoluteTarget))
            return [];
        const stat = fs.statSync(absoluteTarget);
        if (stat.isFile()) {
            return [this.toDiscoveredFile(absoluteTarget)];
        }
        const discovered = [];
        this.walk(absoluteTarget, discovered);
        return discovered.filter(file => this.shouldInclude(file.path));
    }
    walk(currentPath, collected) {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
            if (entry.isDirectory()) {
                if (this.ignoredDirectories.has(entry.name))
                    continue;
                this.walk(fullPath, collected);
                continue;
            }
            if (entry.isFile()) {
                collected.push(this.toDiscoveredFile(fullPath));
            }
        }
    }
    toDiscoveredFile(filePath) {
        return {
            path: filePath,
            language: this.detectLanguage(filePath),
            size: fs.statSync(filePath).size,
        };
    }
    shouldInclude(filePath) {
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
        if (!supportedExtensions.includes(path.extname(filePath).toLowerCase()))
            return false;
        if (filePath.includes("/detectors/") || filePath.includes("\\detectors\\"))
            return false;
        if (filePath.endsWith("cli.ts"))
            return false;
        return true;
    }
    detectLanguage(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const map = {
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
exports.ProjectDiscovery = ProjectDiscovery;
//# sourceMappingURL=project-discovery.js.map