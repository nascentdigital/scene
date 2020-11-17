// imports
import fs from "fs";
import NodeEnvironment from "jest-environment-node";
import { Script } from "vm";
import { getBrowserClass, SERVER_ENDPOINT_FILE } from "./Constants";
import "./types";


// define class
export class SceneEnvironment extends NodeEnvironment {

    async setup() {

        // wait for base setup
        await super.setup();

        // load server endpoint (or fail)
        const serverEndpoint = fs.readFileSync(SERVER_ENDPOINT_FILE, "utf8");
        if (!serverEndpoint) {
            throw new Error(`Scene server endpoint not found.  Did you add 'globalSetup' to your jest.config.ts file?`);
        }

        // connect to the server, and capture the browser instance for tests
        const browserClass = getBrowserClass();
        this.global.browser = await browserClass.connect({ wsEndpoint: serverEndpoint });
    }

    async teardown() {
        await this.global.browser.close();
        await super.teardown();
    }

    runScript<T = unknown>(script: Script): T | null {
        return super.runScript(script);
    }
}
