// imports
import playwright from "playwright";
import { CredentialsRegistry, PasswordCredentials } from "./auth";


// types
export type Configuration = {
    browserOptions?: playwright.LaunchOptions;
    credentials?: CredentialsRegistry<PasswordCredentials>
};
