import { Request, Response, NextFunction } from "express";
import {setResponseWithErrorLog, setResponseWithWarnLog} from "@/utils/messageHandling.js";
import {getLastUpdatedTenant} from "@/lib/database/tenantRepo.js";
import logger from "@/utils/logger.js";

export const verifyTenant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
        setResponseWithErrorLog(res, 401, "User authentication required", "Unauthorized access attempt - No user in request.");
        return;
    }
    
    if (!req.tenant) {
        try {
            req.tenant = await getLastUpdatedTenant(req.user.id) ?? undefined;
        } catch (error) {
            logger.error(`Error defaulting to last updated shopify store`, error);
            setResponseWithWarnLog(res, 403, "Error while getting last updated tenant");
            return;
        }
        
        if (!req.tenant) {
            setResponseWithWarnLog(res, 403, "No shopify store to default to");
            return;
        }
    }

    logger.info(`Successfully verified tenant ${req.tenant.id} of user ${req.user.email}`);
    next();
};