import logger from "../utils/logger";
import {NextFunction, Request, Response} from "express";

export const logRequests = (req: Request, res: Response, next: NextFunction) => {
    logger.http(`[${req.method}] ${req.url}`);
    next();
};