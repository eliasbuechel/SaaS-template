import express, {Application, Request, Response} from 'express';
import {connect} from "./lib/database";
import router from "./routes/router";
import session from 'express-session'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import {dev, allowedCorsOrigin, nodeEnv, sessionSecret} from "./lib/config";

const app: Application = express();
const port: number = 4000;

app.use(
    session({
        secret: sessionSecret,
        saveUninitialized: false,
        cookie: {
            secure: !dev,
            maxAge: 1000 * 60 * 60,
        },
    })
);
app.use(cors({
    origin: allowedCorsOrigin,
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
    return console.log(`Express is listening at http://localhost:${port} in ${nodeEnv} mode`);
});