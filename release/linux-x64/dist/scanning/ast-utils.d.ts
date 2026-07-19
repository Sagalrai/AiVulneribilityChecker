import * as ts from "typescript";
export declare function parseSource(content: string): ts.SourceFile | null;
export declare function stripCommentsAndStrings(content: string): string;
export declare function isDetectorImplementation(filePath: string): boolean;
export declare function isLikelyCommentOrString(node: ts.Node): boolean;
