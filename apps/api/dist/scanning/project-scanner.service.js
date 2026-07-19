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
exports.ProjectScannerService = void 0;
const fs = __importStar(require("fs"));
const project_discovery_1 = require("./engine/project-discovery");
const project_metadata_builder_1 = require("./engine/project-metadata-builder");
class ProjectScannerService {
    analysisService;
    discovery = new project_discovery_1.ProjectDiscovery();
    metadataBuilder = new project_metadata_builder_1.ProjectMetadataBuilder();
    constructor(analysisService) {
        this.analysisService = analysisService;
    }
    getScannableFiles(targetPath) {
        return this.discovery.discover(targetPath).map(file => file.path);
    }
    scan(targetPath) {
        const discoveredFiles = this.discovery.discover(targetPath);
        const metadata = this.metadataBuilder.build(targetPath, discoveredFiles);
        const results = [];
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
exports.ProjectScannerService = ProjectScannerService;
//# sourceMappingURL=project-scanner.service.js.map