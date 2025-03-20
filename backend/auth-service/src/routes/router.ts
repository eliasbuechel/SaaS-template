import { Router, Request, Response } from 'express';
import authRouter from "@/routes/auth/auth.js";
import shopifyAuthRouter from "@/routes/auth/shopifyAuth.js";
import googleAuthRouter from "@/routes/auth/googleAuth.js";
import tenantRouter from "@/routes/tenant.js";
import userRouter from "@/routes/user.js";

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/auth/shopify', shopifyAuthRouter);
router.use('/auth/google', googleAuthRouter);
router.use('/tenant', tenantRouter);
router.use('/user', userRouter);

router.get('/', (_req: Request, res: Response) => {
    res.send('Hello from the router!');
});

router.get('/about', (_req: Request, res: Response) => {
    res.send('About page');
});

export default router;