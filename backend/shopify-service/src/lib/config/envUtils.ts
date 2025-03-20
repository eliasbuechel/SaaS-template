import logger from "@/utils/logger.js";

export function getRequiredEnv<T>(key: string, transformer: (value: string) => T): T {
    const value: string | undefined = process.env[key]?.trim() || undefined;
    if (value === undefined) {
        logger.error(`Error: ${key} environment variable must be defined!`);
        throw new Error(`Missing required environment variable: ${key}`);
    }

    try {
        return transformer(value);
    } catch (error: any) {
        const errorMsg = `Error processing env variable: ${key} (value: ${value})`;
        logger.error(errorMsg, error);
        throw new Error(`${errorMsg}. ${error.message}`);
    }
}

export function getEnvOrDefault<T>(key: string, defaultValue: T, transformer: (value: string) => T): T {
    const value: string | undefined = process.env[key]?.trim() || undefined;
    if (value === undefined) {
        logger.warn(`${key} environment variable not set. Using default: ${defaultValue}`);
        return defaultValue;
    }

    try {
        return transformer(value);
    } catch (error) {
        logger.warn(`Invalid value for ${key}. Using default: ${defaultValue}`, error);
        return defaultValue;
    }
}

export function getDevOnlyRequiredEnv<T>(key: string, transformer: (value: string) => T): T | undefined {
    const dev = process.env.NODE_ENV !== "production";
    if (!dev) return undefined;
    return getRequiredEnv(key, transformer);
}