import { Request, Response, NextFunction } from "express";
import logger from "@/utils/logger.js";

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
    logger.error(error);
    res.status(500).json({ message: "Internal Server Error" });
}