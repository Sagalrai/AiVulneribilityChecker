import * as fs from "fs";
import * as path from "path";
import { Detector } from "../detectors/base-detector";

export class DetectorPluginLoader {
    loadFromDirectory(directory: string): Detector[] {
        if (!fs.existsSync(directory)) return [];

        const detectors: Detector[] = [];
        const entries = fs.readdirSync(directory, { withFileTypes: true });

        for (const entry of entries) {
            if (!entry.isFile() || !entry.name.endsWith(".ts") || entry.name.endsWith(".d.ts")) continue;
            const absolutePath = path.join(directory, entry.name);
            const moduleName = path.basename(entry.name, ".ts");
            if (moduleName.includes("base") || moduleName.includes("registry")) continue;

            try {
                const module = require(absolutePath);
                const exported = module[Object.keys(module).find(key => /Detector$/.test(key)) ?? ""];
                if (typeof exported === "function") {
                    detectors.push(new exported());
                }
            } catch {
                // Ignore incompatible or non-plugin files.
            }
        }

        return detectors;
    }
}
