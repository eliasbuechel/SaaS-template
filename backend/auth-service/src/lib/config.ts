import logger from "../utils/logger";

function getRequiredEnv(key: string): string {
    const value = process.env[key];
    if (value === undefined) {
        logger.error(`Error: ${key} environment variable must be defined!`);
    }
    return value;
}

function getEnvOrDefault(key: string, defaultValue: string): string {
    const value = process.env[key];
    if (value === undefined) {
        logger.warn(`${key} environment variable not set. Using default: ${defaultValue}`);
        return defaultValue;
    }
    return value;
}


export const NODE_ENV: string = getRequiredEnv('NODE_ENV');
export const dev: boolean = NODE_ENV !== 'production';

export const LOG_LEVEL: string = "debug" //getEnvOrDefault('LOG_LEVEL', "info");
export const DATABASE_URL: string = getRequiredEnv('DATABASE_URL');
export const JWT_SECRET: string = getRequiredEnv('JWT_SECRET');
export const JWT_REFRESH_SECRET: string = getRequiredEnv('JWT_REFRESH_SECRET');
export const ENCRYPTION_KEY: string = getRequiredEnv('ENCRYPTION_KEY');
export const ALLOWED_CORS_ORIGIN: string = getRequiredEnv('ALLOWED_CORS_ORIGIN');
export const SESSION_SECRET: string = getRequiredEnv('SESSION_SECRET');
export const GOOGLE_CLIENT_ID: string = getRequiredEnv('GOOGLE_CLIENT_ID');
export const GOOGLE_REDIRECT_URI: string = getRequiredEnv('GOOGLE_REDIRECT_URI');
export const GOOGLE_CLIENT_SECRET: string = getRequiredEnv('GOOGLE_CLIENT_SECRET');
export const SHOPIFY_CLIENT_ID: string = getRequiredEnv('SHOPIFY_CLIENT_ID');
export const SHOPIFY_REDIRECT_URI: string = getRequiredEnv('SHOPIFY_REDIRECT_URI');
export const SHOPIFY_CLIENT_SECRET: string = getRequiredEnv('SHOPIFY_CLIENT_SECRET');

