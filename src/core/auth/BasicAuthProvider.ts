// imports
import { CredentialsRegistry, PasswordCredentials } from "./Credentials";


// class definition
export class BasicAuthProvider {

    /**
     * @param credentials - A mapping of website host to [credentials]{@link PasswordCredentials}.
     */
    public constructor(
        public readonly credentials: Readonly<CredentialsRegistry<PasswordCredentials>> = {}
    ) {
    }


    /**
     * Provides credentials for a specified `URL`.
     *
     * @param url - The URL of the page being accessed.
     * @return `Credentials` required to access the page or `undefined` if the page
     *      allows anonymous access.
     */
    public getCredentials(url: URL): PasswordCredentials | undefined {
        return this.credentials[url.host];
    }
}
