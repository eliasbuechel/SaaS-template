import {Request, Response, NextFunction} from "express";
import logger from "@/utils/logger.js";

export const verifyInternal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        logger.error("Unauthorized internal communication: Missing internal communication secret in request");
        res.status(401).json({ error: "Unauthorized: Missing or invalid secret"});
        return;
    }
    
    const token = authHeader.split(" ")[1];
    
    if (token !== process.env.INTERNAL_AUTH_COMMUNICATION_SECRET) {
        logger.error("Unauthorized internal communication: Wrong internal communication secret in request");
        res.status(403).json({ error: "Forbidden: Invalid token" });
        return;
    }
    
    logger.info("Successfully verified internal communication");
    
    next();
};