import { Request, Response, NextFunction } from "express";
import { getTenantByUserId } from "../lib/database";
import logger from "../utils/logger";
import {setResponseWithErrorLog} from "../utils/messageHandling";

export const verifyTenant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
        setResponseWithErrorLog(res, 401, "User authentication required", "Unauthorized access attempt - No user in request.")
        return;
    }
    
    if (!req.tenant) {
        req.tenant = await getTenantByUserId(req.user.id);
        
        if (!req.tenant) {
            res.status(403).json({ error: "Not connected to Shopify store or not selected a specific store"});
            return;
        }
    }

    logger.info(`Successfully verified tenant ${req.tenant.id} of user ${req.user.email}`);
    next();
};