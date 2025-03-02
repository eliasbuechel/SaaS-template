import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { format } from "winston";

const LOG_LEVEL = process.env.LOG_LEVEL || "info";

const logFormat = format.combine(
    // format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.json()
);

const transports = [
    new winston.transports.Console({
        format: format.combine(format.colorize(), format.simple()),
    }),
    new DailyRotateFile({
        filename: "logs/application-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
    }),
];

const logger = winston.createLogger({
    level: LOG_LEVEL,
    format: logFormat,
    transports,
});

logger.info("Log level is set to: ", LOG_LEVEL);

logger.exceptions.handle(
    new winston.transports.File({ filename: "logs/exceptions.log" })
);

process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Rejection:", reason);
});

export default logger;
