import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../lib/config";
import logger from "../utils/logger";

export const decodeToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies["access_token"];

    if (!token) {
        logger.debug("No access token provided in request.");
        return next();
    }

    try {
        req.decodedToken = jwt.verify(token, JWT_SECRET) as { id: string; email: string; tenant_id?: string };
        logger.info(`JWT verified successfully for user ${req.decodedToken.id} (${req.decodedToken.email})`);
    } catch (error) {
        logger.warn(`JWT verification failed: ${error.message}`);
    }

    next();
};