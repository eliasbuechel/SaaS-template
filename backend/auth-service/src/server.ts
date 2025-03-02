import express, {Application, Request, Response} from 'express';
import {connect} from "./lib/database";
import router from "./routes/router";
import session from 'express-session'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import {dev, ALLOWED_CORS_ORIGIN, NODE_ENV, SESSION_SECRET} from "./lib/config";
import logger from "./utils/logger";

const app: Application = express();
const port: number = 4000;

app.use(
    session({
        secret: SESSION_SECRET,
        saveUninitialized: false,
        cookie: {
            secure: !dev,
            maxAge: 1000 * 60 * 60,
        },
    })
);
app.use(cors({
    origin: ALLOWED_CORS_ORIGIN,
    credentials: true,
}));
app.use(cookieParser());
app.use('/api', router);

connect()

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the auth-service!');
});

app.listen(port, () => {
    logger.info(`Express is listening at http://localhost:${port} in ${NODE_ENV} mode`);
});

logger.error("Something went wrong!");
logger.warn("This is a warning.");
logger.info("Server started successfully.");
logger.http("GET /api/auth/status");
logger.verbose("Verbose details about processing.");
logger.debug("Debugging details - useful for development.");
logger.silly("Random low-priority message.");