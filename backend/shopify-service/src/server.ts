import { DEV } from "./lib/config/baseEnv.js";
import ENV from "./lib/config/env.js";
import cors from "cors";
import http from "http";
import helmet from "helmet";
import express, { Application, Request, Response } from "express";
import session from "express-session";
import compression from "compression";
import cookieParser from "cookie-parser";
import logger from "./utils/logger.js";
import router from "./routes/router.js";
import redisClient, { connectToRedis } from "./lib/redis.js";
import { RedisStore } from "connect-redis";

const app: Application = express();
const port = ENV.PORT;

app.use(helmet());
app.use(
  cors({
    origin: ENV.ALLOWED_CORS_ORIGIN.split(","),
    credentials: true,
  }),
);

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
  connectToRedis();
  sessionOptions.store = new RedisStore({ client: redisClient });
}

app.use(session(sessionOptions));

app.use(router);

app.get("/healthy", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

const server: http.Server = http.createServer(app);
server.listen(port, () => {
  logger.info(
    `Express is listening at http://localhost:${port} in ${ENV.NODE_ENV} mode`,
  );
});

process.on("uncaughtException", (error: any) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  logger.warn("Unhandled Promise Rejection:", reason);
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received: Closing server...");
  server.close(() => {
    logger.info("HTTP server closed.");
    process.exit(0);
  });
});
