// imports
import { InvalidOperationError } from "@nascentdigital/errors";
import { Scribe } from  "@nascentdigital/scribe";
import { Browser, BrowserContext, BrowserContextOptions, Page, Response } from "playwright";
import { BasicAuthProvider } from "./auth";
import { Configuration } from "./Configuration";
import { Ref } from "./Ref";


// types
export interface SceneContext extends BrowserContext {
    newPage(): Promise<ScenePage>;
}

export interface ScenePage extends Page {

    context(): SceneContext;

    /**
     * Navigates to the specified URL, waiting until the page and all resources are fetched.
     *
     * @param url - The URL of the page to load.
     */
    navigateTo(url: URL): Promise<null | Response>;
}


// constants
export const TOKEN_PAGE = Symbol("scene:ScenePage");
const log = Scribe.getLog("scene:Scene");


// class definition
export class Scene {

    private readonly basicAuthProvider: BasicAuthProvider;

    public constructor(
        public readonly browser: Browser,
        options: Configuration = {}
    ) {
        this.basicAuthProvider = new BasicAuthProvider(options.credentials);
    }

    public useBrowserContext(options?: BrowserContextOptions, shared?: boolean): SceneContext {

        // create ref + proxy
        const browserContextRef = new Ref<BrowserContext>();
        const browserContextProxy = new Proxy<SceneContext>({} as  SceneContext, {
            get: (obj, prop) => {

                // throw if ref isn't bound
                const instance = browserContextRef.current;
                if (!instance) {
                    throw new InvalidOperationError("Attempt to use uninitialized BrowserContext.");
                }

                // intercept "newPage" to convert it to a ScenePage
                if (prop === "newPage") {
                    return async () => {
                        const page = await instance.newPage();
                        return this.createPage(new Ref<Page>(page), browserContextProxy);
                    };
                }

                // proxy getter
                return (instance as any)[prop];
            },
            set: (obj, prop, value) => {

                // throw if ref isn't bound
                const instance = browserContextRef.current;
                if (!instance) {
                    throw new InvalidOperationError("Attempt to use uninitialized BrowserContext.");
                }

                // proxy setter
                (instance as any)[prop] = value;

                // indicate success
                return true;
            }
         });

        // initialize ref (beforeAll vs beforeEach based on ref sharing)
        const initialize = shared ? beforeAll : beforeEach;
        initialize(async (done) => {
            browserContextRef.current = await this.browser.newContext(options);
            done();
        });

        // finalize ref (afterAll vs afterEach based on ref sharing)
        const finalize = shared ? afterAll : afterEach;
        finalize(async (done) => {
            await browserContextRef.value.close();
            browserContextRef.current = undefined;
            done();
        });

        // return context
        return browserContextProxy;
    }

    public usePage(options?: BrowserContextOptions, shared?: boolean): ScenePage {

        // create a browser context (we want to share it for all tests)
        const browserContext = this.useBrowserContext(options, true);

        // create ref + proxy
        const pageRef = new Ref<Page>();
        const page = this.createPage(pageRef, browserContext);

        // initialize ref (beforeAll vs beforeEach based on ref sharing)
        const initialize = shared ? beforeAll : beforeEach;
        initialize(async (done) => {
            pageRef.current = await browserContext.newPage();
            done();
        });

        // finalize ref (afterAll vs afterEach based on ref sharing)
        const finalize = shared ? afterAll : afterEach;
        finalize(async (done) => {
            await pageRef.value.close();
            pageRef.current = undefined;
            done();
        });

        // return context
        return page;
    }

    private createPage(pageRef: Ref<Page>, context: SceneContext): ScenePage {
        return new Proxy<ScenePage>({} as  ScenePage, {
            get: (obj, prop) => {

                // throw if ref isn't bound
                const instance = pageRef.current;
                if (!instance) {
                    throw new InvalidOperationError("Attempt to use uninitialized Page.");
                }

                // intercept the "context" method
                if (prop === "context") {
                    return () => context;
                }

                // intercept the "goto" method
                if (prop === "goto") {
                    return (uri: string) => this.navigateTo(new URL(uri), instance);
                }

                // intercept the "navigate" method
                if (prop === "navigateTo") {
                    return (url: URL) => this.navigateTo(url, instance);
                }

                // proxy getter
                return (instance as any)[prop];
            },
            set: (obj, prop, value) => {

                // throw if ref isn't bound
                const instance = pageRef.current;
                if (!instance) {
                    throw new InvalidOperationError("Attempt to use uninitialized Page.");
                }

                // proxy setter
                (instance as any)[prop] = value;

                // indicate success
                return true;
            }
        });
    }

    private async navigateTo(url: URL, page: Page) {

        // attach any basic auth credentials (as required)
        const { basicAuthProvider } = this;
        const credentials = basicAuthProvider
            ? basicAuthProvider.getCredentials(url)
            : undefined;
        if (credentials) {

            // copy URL (so we don't mess up the caller)
            url = new URL(url.href);

            // apply credentials
            url.username = credentials.username;
            url.password = credentials.password;

            log.debug("attached credentials to URL");
        }

        log.debug("navigating to ", url.href);

        // navigate to page
        await page.goto(url.href, { waitUntil: "load" });
    }
}
