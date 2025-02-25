function getRequiredEnv(key: string): string {
    const value = process.env[key];
    if (value === undefined) {
        console.error(`Error: ${key} environment variable must be defined!`);
    }
    return value;
}

export function getEnvOrDefault(key: string, defaultValue: string): string {
    const value = process.env[key];
    if (value === undefined) {
        console.warn(`Warning: ${key} environment variable not set. Using default: ${defaultValue}`);
        return defaultValue;
    }
    return value;
}

export const dev: boolean = process.env.NODE_ENV !== 'production';
export const nodeEnv: string = getRequiredEnv('NODE_ENV');
export const databaseUrl: string = getRequiredEnv('DATABASE_URL');
export const allowedCorsOrigin: string = getRequiredEnv('ALLOWED_CORS_ORIGIN');
export const sessionSecret: string = getRequiredEnv('SESSION_SECRET');
export const googleClientId: string = getRequiredEnv('GOOGLE_CLIENT_ID');
export const googleRedirectUri: string = getRequiredEnv('GOOGLE_REDIRECT_URI');
export const googleRedirectSecret: string = getRequiredEnv('GOOGLE_CLIENT_SECRET');
export const shopifyClientId: string = getRequiredEnv('SHOPIFY_CLIENT_ID');
export const shopifyRedirectUri: string = getRequiredEnv('SHOPIFY_REDIRECT_URI');
export const shopifyClientSecret: string = getRequiredEnv('SHOPIFY_CLIENT_SECRET');

