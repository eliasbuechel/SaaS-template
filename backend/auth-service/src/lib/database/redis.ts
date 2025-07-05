import { createClient } from "redis";
import logger from "@/utils/logger.js";
import ENV from "@/lib/config/env.js";

const redisClient = createClient({
    url: ENV.REDIS_DATABASE_URL,
});

redisClient.on("connect", () => {
    logger.info("Connected to redis database");
});

redisClient.on("error", (error) => {
    logger.error("Redis database connection error:", error);
});

export const connectToRedisDb = async (): Promise<void> => {
    if (redisClient.isReady)
        return;
    
    logger.debug(`Connecting to redis database at ${ENV.REDIS_DATABASE_URL}...`);

    try {
        await redisClient.connect();
        logger.info("Successfully connected to redis database");
    } catch (error: any) {
        logger.error("Failed to connect to redis database:", error);
        throw Error(error);
    }
};

connectToRedisDb();

export default redisClient;