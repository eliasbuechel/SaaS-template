import * as crypto from "node:crypto";
import {Router, Request, Response} from "express";
import {dev, SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET, SHOPIFY_REDIRECT_URI} from "../lib/config";
import {getTenantByShopifyStoreDomainOrUpdate, getUserById} from "../lib/database";
import {encryptToken} from "../utils/encryption";
import {ITenant} from "../interfaces/ITenant";
import {decodeToken} from "../middleware/decodeToken";
import {verifyUser} from "../middleware/verifyUser";
import {generateAccessToken} from "../utils/generateToken";
import logger from "../utils/logger";

const shopifyRouter: Router = Router();

shopifyRouter.get("/auth", decodeToken, verifyUser, (req: Request, res: Response): Promise<void> => {
    const shop: string = req.query.shop as string;
    if (!shop) {
        res.status(400).json({ error: 'No shop provided' });
        return
    }

    if (!req.user) {
        res.status(403).json({ error: "Unauthorized request" });
        return
    }
    
    const scopes = 'write_products';
    const statePayload = {
        userId: req.user.id,
        nonce: crypto.randomBytes(16).toString("hex"),
    };

    const state = Buffer.from(JSON.stringify(statePayload)).toString("base64");
    req.session.shopifyOAuthState = state;

    const authUrl = `https://${shop}.myshopify.com/admin/oauth/authorize` +
        `?client_id=${SHOPIFY_CLIENT_ID}` +
        `&scope=${encodeURIComponent(scopes)}` +
        `&redirect_uri=${encodeURIComponent(SHOPIFY_REDIRECT_URI)}` +
        `&state=${encodeURIComponent(state)}`;
    
    console.log('Redirecting URL: ', authUrl);

    res.json({ redirectUrl: authUrl });
});

shopifyRouter.get('/oauth2callback' , async (req: Request, res: Response): Promise<void> => {
    const { shop, code, state } = req.query as { shop?: string; code?: string; state?: string };
    
    if (state !== req.session.shopifyOAuthState) {
        res.status(403).json({ error: 'Invalid state parameter' });
        return
    }

    let userId: string;
    try {
        const statePayload = JSON.parse(Buffer.from(state, "base64").toString("utf-8"));
        if (!statePayload.userId) {
            throw new Error("Invalid state parameter: Missing userId");
        }
        userId = statePayload.userId;
    } catch (error) {
        logger.error("Invalid state parameter:", error);
        res.status(400).json({ error: "Invalid state parameter" });
        return;
    }
    delete req.session.shopifyOAuthState;

    if (!shop || !code) {
        res.status(400).json({ error: 'Missing required parameters' });
        return
    }
    
    try {
        const tokenUrl = `https://${shop}/admin/oauth/access_token`;
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: SHOPIFY_CLIENT_ID,
                client_secret: SHOPIFY_CLIENT_SECRET,
                code: code,
            }),
        });
        
        const data = await response.json();
        if (!data.access_token) {
            res.status(400).json({ error: "Failed to get access token from Shopify" });
            return
        }

        const encryptedShopifyAccessToken = encryptToken(data.access_token);
        
        const tenant: ITenant = await getTenantByShopifyStoreDomainOrUpdate(shop, encryptedShopifyAccessToken, userId);
        if (!tenant) {
            logger.error("Not able to retrieve tenant for the shop ", shop);
            throw new Error("Not able to retrieve tenant for the shop " + shop)
        }

        const user = await getUserById(userId);
        if (!user) {
            logger.error("Not able to retrieve User ", userId);
            throw new Error("Not able to retrieve User " + userId)
        }
        
        const accessToken = generateAccessToken(user, tenant.id);
        res.cookie("access_token", accessToken, { httpOnly: true, secure: !dev, sameSite: "lax" });
        
        logger.info(`Shopify store ${tenant.shopifyStoreDomain} connected for user ${user.email}`);
        res.redirect("http://localhost:3000/dashboard");
    } catch (error) {
        logger.error("Shopify OAuth error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default shopifyRouter;