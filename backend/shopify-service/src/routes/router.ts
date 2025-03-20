import {Router, Request, Response} from "express";
import shopifyRouter from "./shopifyRoutes.js";

const router: Router = Router();

router.use("/api", shopifyRouter);

router.get('/', (_req: Request, res: Response): void => {
    res.send('Hello from the router!');
});

export default router;