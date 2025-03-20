import {NextFunction, Request, Response} from "express";
import logger from "@/utils/logger.js";

export const logRequests = (req: Request, _res: Response, next: NextFunction) => {
    logger.http(`[${req.method}] ${req.url}`);
    next();
};