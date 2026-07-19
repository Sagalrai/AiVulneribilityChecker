import * as path from "path";
import { Detector } from "./detectors/base-detector";
import { DetectorPluginLoader } from "./engine/detector-plugin-loader";

export class DetectorRegistry {
    private readonly detectors: Detector[];

    constructor() {
        const loader = new DetectorPluginLoader();
        const detectorDirectory = path.resolve(__dirname, "detectors");
        this.detectors = loader.loadFromDirectory(detectorDirectory);
    }

    getDetectors(): Detector[] {
        return this.detectors;
    }
}
