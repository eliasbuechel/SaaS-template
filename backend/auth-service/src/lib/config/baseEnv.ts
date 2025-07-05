import fs from "fs";
import dotenv from "dotenv";

if (!fs.existsSync("/.dockerenv")) {
    console.log("🖥️ Running outside Docker");
    console.log("Loading environment variables using dotenv...");
    try {
        dotenv.config({path: ".env.local"});
        if (fs.existsSync(".env.secret")) {
            dotenv.config({ path: ".env.secret", override: true });
            console.log("Loaded additional secrets from .env.secret.");
        }
    } catch (error) {
        console.log("Error while loading .env using dotenv", error);
        process.exit(1);
    }

    console.log("Environment variables loaded using dotenv");
} else {
    console.log("🐳 Running inside Docker (Skipping the loading of environment variables using dotenv)");
}

import TRANSFORMERS from "@/lib/config/transformers.js";
import {getEnvOrDefault, getRequiredEnv} from "@/lib/config/envUtils.js";


export enum NodeEnv {
    Development = "development",
    Production = "production"
}

interface BaseEnv {
    NODE_ENV: NodeEnv;
    HOST_NAME: string;
    PORT: number;
    ALLOWED_CORS_ORIGIN: string;

    REDIS_DATABASE_URL: string;
    SESSION_SECRET: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    ENCRYPTION_KEY: string;
}

const BASE_ENV: BaseEnv = {
    NODE_ENV: getRequiredEnv('NODE_ENV', TRANSFORMERS.NODE_ENV),
    HOST_NAME: getRequiredEnv('HOST_NAME', TRANSFORMERS.STRING),
    PORT: getEnvOrDefault("PORT", 4000, TRANSFORMERS.NUMBER),
    ALLOWED_CORS_ORIGIN: getRequiredEnv('ALLOWED_CORS_ORIGIN', TRANSFORMERS.STRING),

    REDIS_DATABASE_URL: getRequiredEnv("REDIS_DATABASE_URL", TRANSFORMERS.STRING),
    SESSION_SECRET: getRequiredEnv('SESSION_SECRET', TRANSFORMERS.STRING),
    JWT_ACCESS_SECRET: getRequiredEnv('JWT_ACCESS_SECRET', TRANSFORMERS.STRING),
    JWT_REFRESH_SECRET: getRequiredEnv('JWT_REFRESH_SECRET', TRANSFORMERS.STRING),
    ENCRYPTION_KEY: getRequiredEnv('ENCRYPTION_KEY', TRANSFORMERS.STRING),
};

export const DEV: boolean = BASE_ENV.NODE_ENV !== NodeEnv.Production;
export default BASE_ENV;