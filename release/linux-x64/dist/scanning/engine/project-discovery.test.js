"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const project_discovery_1 = require("./project-discovery");
describe("ProjectDiscovery", () => {
    it("skips noisy directories and returns supported source files", () => {
        const discovery = new project_discovery_1.ProjectDiscovery();
        const discovered = discovery.discover(".");
        expect(discovered.some(file => file.path.includes("/node_modules/"))).toBe(false);
        expect(discovered.some(file => file.path.endsWith("cli.ts"))).toBe(false);
    });
});
//# sourceMappingURL=project-discovery.test.js.map