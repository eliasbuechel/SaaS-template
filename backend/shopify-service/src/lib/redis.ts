import { createClient } from "redis";
import logger from "../utils/logger.js";
import ENV from "./config/env.js";

const redisClient = createClient({
    url: ENV.REDIS_URL,
});

redisClient.on("connect", () => {
    logger.info("Connected to Redis");
});

redisClient.on("error", (err: any) => {
    logger.error("Redis connection error:", err);
});

export const connectToRedis = () => {
    logger.info(`Connecting to redis at ${ENV.REDIS_URL}...`);
    redisClient
        .connect()
        .catch((error) => logger.error("Not able to connect to redis", error));
};

export default redisClient;