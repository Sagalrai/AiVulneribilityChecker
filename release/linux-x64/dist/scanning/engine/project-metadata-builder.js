"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectMetadataBuilder = void 0;
class ProjectMetadataBuilder {
    build(targetPath, files) {
        const languageCount = files.reduce((acc, file) => {
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
exports.ProjectMetadataBuilder = ProjectMetadataBuilder;
//# sourceMappingURL=project-metadata-builder.js.map