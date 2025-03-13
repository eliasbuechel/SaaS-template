import {Router, Request, Response} from "express";

const router: Router = Router();

router.get('/', (_req: Request, res: Response): void => {
    res.send('Hello from the router!');
});

export default router;