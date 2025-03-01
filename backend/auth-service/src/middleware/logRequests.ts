import logger from "../utils/logger";
import {NextFunction, Request, Response} from "express";

export const logRequests = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`[${req.method}] ${req.url} - User: ${req.user?.id || "Guest"}`);
    next();
};