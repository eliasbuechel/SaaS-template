import { Request, Response, NextFunction } from "express";
import { getTenantByUserId } from "../lib/database";
import logger from "../utils/logger";

export const verifyTenant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
        logger.warn(`Unauthorized access attempt - No user in request.`);
        res.status(401).json({ error: "User authentication required" });
        return;
    }

    try {
        const tenant = await getTenantByUserId(req.user.id);
        if (!tenant) {
            logger.warn(`User ${req.user.id} is not connected to a Shopify store.`);
            res.status(403).json({ error: "Not connected to Shopify store" });
            return;
        }

        req.tenant = tenant;
        logger.info(`Tenant verified: ${tenant.id} for user ${req.user.id}`);
        next();
    } catch (error) {
        logger.error(`Error fetching tenant for user ${req.user.id}: ${error.message}`, { stack: error.stack });
        next(error);
    }
};
