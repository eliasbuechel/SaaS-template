import { Router, Request, Response } from 'express';
import tenantRouter from "./tenant";
import shopifyAuthRouter from "./auth/shopifyAuth";
import googleAuthRouter from "./auth/googleAuth";
import authRouter from "./auth/auth";

const router: Router = Router();

router.use('/auth', authRouter)
router.use('/auth/shopify', shopifyAuthRouter)
router.use('/auth/google', googleAuthRouter)
router.use(tenantRouter)

router.get('/', (req: Request, res: Response) => {
    res.send('Hello from the router!');
});

router.get('/about', (req: Request, res: Response) => {
    res.send('About page');
});

export default router;
