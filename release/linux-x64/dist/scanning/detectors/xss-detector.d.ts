import { Detector, DetectorFinding } from "./base-detector";
export declare class XssDetector implements Detector {
    name: string;
    detect(content: string, filePath: string, language: string): DetectorFinding[];
}
