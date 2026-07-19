import * as ts from "typescript";

export function parseSource(content: string): ts.SourceFile | null {
    try {
        return ts.createSourceFile("temp.ts", content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    } catch {
        return null;
    }
}

export function stripCommentsAndStrings(content: string): string {
    const sourceFile = parseSource(content);
    if (!sourceFile) return content;

    const printer = ts.createPrinter({ removeComments: true });
    return printer.printFile(sourceFile);
}

export function isDetectorImplementation(filePath: string): boolean {
    return filePath.includes("/detectors/") || filePath.includes("\\detectors\\") || filePath.endsWith("cli.ts");
}

export function isLikelyCommentOrString(node: ts.Node): boolean {
    return ts.isStringLiteralLike(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isStringLiteral(node);
}
