import { Router, Request, Response } from 'express';
import shopifyRouter from "./shopify";
import googleRouter from "./google";
import authRouter from "./auth";
import tenantRouter from "./tenant";

const router: Router = Router();

router.use('/shopify', shopifyRouter)
router.use('/google', googleRouter)
router.use('/auth', authRouter)
router.use(tenantRouter)

router.get('/', (req: Request, res: Response) => {
    res.send('Hello from the router!');
});

router.get('/about', (req: Request, res: Response) => {
    res.send('About page');
});

export default router;
