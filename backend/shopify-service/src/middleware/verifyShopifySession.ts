import {Request, Response, NextFunction} from "express";
import ENV from "@/lib/config/env.js";
import logger from "@/utils/logger.js";

export const verifyShopifySession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const cookies = req.headers.cookie;

        const response = await fetch(`${ENV.INTERNAL_AUTH_SERVICE_URL}/api/auth/shopify/session`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Cookie": cookies || "",
                "Authorization": `Bearer ${ENV.INTERNAL_AUTH_COMMUNICATION_SECRET}`
            }
        });

        if (!response.ok) {
            logger.error(`Error while retrieving shopify credentials. Received response status ${response.status}`);
            res.status(401).send("Not authorized");
            return;
        }

        const credentials = await response.json() as {shopifyStoreDomain:string, shopifySessionId:string};
        req.shopifyStoreDomain = credentials.shopifyStoreDomain;
        req.shopifySessionId = credentials.shopifySessionId;
        
        next();
    }
    catch (error) {
        logger.error(`Error fetching shopify credentials`, error);
    }
}