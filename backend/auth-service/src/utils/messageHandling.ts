import logger from "./logger";
import {Request, Response} from "express";

export const setResponseWithErrorLog = (
    res: Response,
    statusCode: number,
    message: string,
    details?: string,
    error?: unknown
): void => {
    let logMessage = message;
    if (details) logMessage += ` | Details: ${details}`;
    
    if (error instanceof Error) {
        logger.error(logMessage, { stack: error.stack });
    } else {
        logger.error(logMessage);
    }
    
    res.status(statusCode).json({
        error: message,
        ...(details && { details })
    });
};

export const setResponseWithWarnLog = (
    res: Response,
    statusCode: number,
    message: string,
    details?: string,
    error?: unknown
): void => {
    let logMessage = message;
    if (details) logMessage += ` | Details: ${details}`;

    if (error instanceof Error) {
        logger.warn(logMessage, { stack: error.stack });
    } else {
        logger.warn(logMessage);
    }
    
    res.status(statusCode).json({
        error: message,
        ...(details && { details })
    });
};

export const redirectToErrorPage = (req: Request, res: Response, redirectUrlAfterError: string, code: number, message: string, error: Error): void => {
    logger.error(message, error);
const redirectUrl = `${redirectUrlAfterError}?code=${code}&message=${message}&details=${error.message}&timestamp=${Date().toString()}&path=${req.originalUrl}`;
    res.redirect(redirectUrl);
};