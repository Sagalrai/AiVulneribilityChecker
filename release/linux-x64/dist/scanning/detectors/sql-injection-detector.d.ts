import { Detector, DetectorFinding } from "./base-detector";
export declare class SqlInjectionDetector implements Detector {
    name: string;
    detect(content: string, filePath: string, language: string): DetectorFinding[];
}
