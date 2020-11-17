// imports
import { Browser } from "playwright";


// declaration merging
declare global {
    namespace NodeJS {
        interface Global {
            browser: Browser;
        }
    }
}
declare global {
    const browser: Browser;
}
