import {Router, Request, Response} from "express";
import {logRequests} from "../middleware/logRequests";
import {verifyUser} from "../middleware/verifyUser";
import {verifyTenant} from "../middleware/verifyTenant";
import {decryptToken} from "../lib/encryption";

const shopifyRouter = Router();

shopifyRouter.get('/credentials', logRequests, verifyUser, verifyTenant, (req: Request, res: Response): void => {
    const shopifyStoreDomain: string = req.tenant.shopifyStoreDomain;
    const shopifyAccessToken: string = decryptToken(req.tenant.shopifyAccessToken);
    res.json({storeDomain: shopifyStoreDomain, accessToken: shopifyAccessToken});
});