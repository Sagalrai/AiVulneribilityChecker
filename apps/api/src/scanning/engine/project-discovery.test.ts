import { ProjectDiscovery } from "./project-discovery";

describe("ProjectDiscovery", () => {
    it("skips noisy directories and returns supported source files", () => {
        const discovery = new ProjectDiscovery();
        const discovered = discovery.discover(".");

        expect(discovered.some(file => file.path.includes("/node_modules/"))).toBe(false);
        expect(discovered.some(file => file.path.endsWith("cli.ts"))).toBe(false);
    });
});
