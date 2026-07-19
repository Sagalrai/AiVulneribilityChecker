import { Detector } from "./detectors/base-detector";
export declare class DetectorRegistry {
    private readonly detectors;
    constructor();
    getDetectors(): Detector[];
}
