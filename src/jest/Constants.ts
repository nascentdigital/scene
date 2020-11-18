// imports
import os from "os";
import path from "path";
import playwright, { Browser } from "playwright";
import { isBrowserType } from "./BrowserType";


// constants
export const TEMP_DIRECTORY = path.join(os.tmpdir(), "jest-scene-data");
export const SERVER_ENDPOINT_FILE = path.join(TEMP_DIRECTORY, "endpoint-server.txt");
export const SCENE_CONFIG = "scene.config.js";


// helpers
export function getBrowserClass(): playwright.BrowserType<Browser> {

    // resolve browser class
    const browserType = isBrowserType(process.env.SCENE_BROWSER)
        ? process.env.SCENE_BROWSER
        : "chromium";
    switch (browserType) {
        case "chromium":
            return  playwright.chromium;
        case "firefox":
            return playwright.firefox;
        case "webkit":
            return playwright.webkit;
        default:
            throw new Error(`Unable to resolve playwright browser named "${browserType}".`);
    }
}
