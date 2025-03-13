import express, {Application, Request, Response} from 'express';
import router from "./routes/router";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from "./utils/logger";
import {connectToPostgresDb} from "./lib/database/postgresConnection";
import ENV from "./lib/config/env";
import {DEV} from "./lib/config/baseEnv";
import http from "http";
import helmet from "helmet";
import compression from "compression";
import redisClient, {connectToRedisDb} from "./lib/database/redis";
import {RedisStore} from "connect-redis";

const app: Application = express();

app.use(helmet());
app.use(cors({
    origin: ENV.ALLOWED_CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    sessionOptions.store = new RedisStore({ client: redisClient });
}

app.use(session(sessionOptions));


app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the auth-service!');
});

const server: http.Server = http.createServer(app);

const startServer = async () => {
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