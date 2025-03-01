import { Request, Response, NextFunction } from "express";
import { getUserById } from "../lib/database";
import { IUser } from "../interfaces/IUser";
import logger from "../utils/logger";

export const verifyUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.decodedToken) {
        logger.warn("Unauthorized access attempt - No token provided.");
        res.status(401).json({ error: "Not authenticated" });
        return;
    }

    try {
        const user: IUser | null = await getUserById(req.decodedToken.id);
        if (!user) {
            logger.warn(`Authentication failed - User ${req.decodedToken.id} not found.`);
            res.status(401).json({ error: "User not found" });
            return;
        }

        req.user = user;
        logger.info(`User verified: ${user.id} (${user.email})`);
        next();
    } catch (error) {
        logger.error(`Error fetching user with ID ${req.decodedToken.id}: ${error.message}`, { stack: error.stack });
        next(error);
    }
};
