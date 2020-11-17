// types
export type BrowserType = "chromium" | "firefox" | "webkit";


// constants
export const BrowserTypes: ReadonlyArray<BrowserType> = [
    "chromium",
    "firefox",
    "webkit"
];
Object.freeze(BrowserTypes);


// type guard
export function isBrowserType(value: any): value is BrowserType {
    return typeof value === "string"
        && BrowserTypes.some(browserType => browserType === value);
}
