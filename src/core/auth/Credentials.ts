// types

/**
 * Represents authentication credentials.
 */
export interface Credentials {}

/**
 * Represents username + password credentials.
 */
export interface PasswordCredentials extends Credentials {
    username: string;
    password: string;
}

/**
 * Provides credentials for a given host (i.e domain + port).
 */
export type CredentialsRegistry<TCredentials extends Credentials> = Record<string, TCredentials>;
