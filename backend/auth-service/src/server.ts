import {DEV} from "@/lib/config/baseEnv.js";
import ENV from "@/lib/config/env.js";
import logger from "@/utils/logger.js";
import express, {Application, Request, Response} from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from "http";
import helmet from "helmet";
import compression from "compression";
import {RedisStore} from "connect-redis";
import redisClient, {connectToRedisDb} from "@/lib/database/redis.js";
import router from "@/routes/router.js";
import {connectToPostgresDb} from "@/lib/database/postgresConnection.js";

const app: Application = express();

app.use(helmet());
app.use(cors({
    origin: ENV.ALLOWED_CORS_ORIGIN.split(","),
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(compression());

if (!DEV) {
    app.set("trust proxy", 1);
}

app.use(cookieParser());

const sessionOptions: session.SessionOptions = {
    secret: ENV.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: !DEV,
        maxAge: 1000 * 60 * 60,
    },
};


if (!DEV) {
    sessionOptions.store = new RedisStore({client: redisClient});
}

app.use(session(sessionOptions));


app.use('/api', router);

app.get('/', (_req: Request, res: Response) => {
    res.send('Welcome to the auth-service!');
});

app.get('/healthy', (_req: Request, res: Response) => {
    res.status(200).send('OK');
});

const server: http.Server = http.createServer(app);

const startServer = async () => {
    logger.info("Starting server ...");
    try {
        await connectToPostgresDb();
        if (!DEV) {
            await connectToRedisDb();
        }

        server.listen(ENV.PORT, () => {
            logger.info(`Server is running at http://localhost:${ENV.PORT} in ${ENV.NODE_ENV} mode`);
        });
    } catch (error) {
        logger.error("Server startup failed:", error);
        process.exit(1);
    }
};

startServer();

process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception:", error);
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    logger.warn("Unhandled Promise Rejection:", reason);
});

process.on("SIGTERM", () => {
    logger.info("SIGTERM received: Closing server...");
    server.close(() => {
        logger.info("HTTP server closed.");
        process.exit(0);
    });
});

process.on("SIGINT", () => {
    console.log("SIGINT (Ctrl+C) received - process exiting...");
    process.exit(0);
});