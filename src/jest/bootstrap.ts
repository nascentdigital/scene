// imports
import type { Config as JestConfig } from "@jest/types";
import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";
import { BrowserServer } from "playwright";
import { getBrowserClass, SCENE_CONFIG, SERVER_ENDPOINT_FILE, TEMP_DIRECTORY } from "./Constants";


// declaration merging
declare global {
    namespace NodeJS {
        interface Global {
            browserServer: BrowserServer;
        }
    }
}


// methods
export async function setup(jestConfig: JestConfig.GlobalConfig) {

    // load global config
    const configPath = path.join(jestConfig.rootDir, SCENE_CONFIG);
    const config = require(configPath);

    // launch a browser server + save reference
    const browserClass = getBrowserClass();
    const browserServer = await browserClass.launchServer(config.browserOptions);
    global.browserServer = browserServer;

    // write server endpoint to disk
    await mkdirp(TEMP_DIRECTORY);
    fs.writeFileSync(SERVER_ENDPOINT_FILE, browserServer.wsEndpoint());
}

export async function teardown() {

    // launch a browser server + save reference
    await global.browserServer.close();
}
