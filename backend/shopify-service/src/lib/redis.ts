import ENV from "@/lib/config/env.js";
import logger from "@/utils/logger.js";
import { createClient } from "redis";

const redisClient = createClient({
    url: ENV.REDIS_DB_URL,
});

redisClient.on("connect", () => {
    logger.info("Connected to Redis");
});

redisClient.on("error", (err: any) => {
    logger.error("Redis connection error:", err);
});

export const connectToRedis = () => {
    logger.info(`Connecting to redis at ${ENV.REDIS_DB_URL}...`);
    redisClient
        .connect()
        .catch((error) => logger.error("Not able to connect to redis", error));
};

export default redisClient;