import { Session } from "@shopify/shopify-api";
import logger from "@/utils/logger.js";
import redisClient from "@/lib/database/redis.js";

const SESSION_PREFIX = "shopify_sessions:";

export const redisShopifySessionStorage = {
    async storeSession(session: Session): Promise<boolean> {
        if (!session || !session.id) {
            logger.error("Invalid session data. Cannot store session.");
            return false;
        }

        try {
            const sessionData = JSON.stringify(session.toObject());
            await redisClient.set(`${SESSION_PREFIX}${session.id}`, sessionData, { EX: 60 * 60 * 24 * 30 }); // Expire in 30 days
            logger.info(`Stored Shopify session for ${session.shop}`);
            return true;
        } catch (error) {
            logger.error("Failed to store Shopify session in Redis:", error);
            return false;
        }
    },

    async loadSession(sessionId: string): Promise<Session | undefined> {
        if (!sessionId) return undefined;

        try {
            const sessionData = await redisClient.get(`${SESSION_PREFIX}${sessionId}`);
            if (!sessionData) {
                logger.warn(`No session found in Redis for ${sessionId}`);
                return undefined;
            }

            const sessionObject = JSON.parse(sessionData);
            const session = new Session(sessionObject.id);
            Object.assign(session, sessionObject);
            return session;
        } catch (error) {
            logger.error("Error loading Shopify session from Redis:", error);
            return undefined;
        }
    },

    async deleteSession(sessionId: string): Promise<boolean> {
        if (!sessionId) return false;

        try {
            await redisClient.del(`${SESSION_PREFIX}${sessionId}`);
            logger.info(`Deleted Shopify session for ${sessionId}`);
            return true;
        } catch (error) {
            logger.error("Error deleting Shopify session from Redis:", error);
            return false;
        }
    }
};
