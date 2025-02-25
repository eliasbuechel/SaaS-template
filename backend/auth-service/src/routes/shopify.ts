import * as crypto from "node:crypto";
import {Router, Request, Response} from "express";
import {shopifyClientId, shopifyClientSecret, shopifyRedirectUri} from "../lib/config";

const shopifyRouter: Router = Router();

function generateRandomString(length = 64) {
    return crypto.randomBytes(length).toString('hex');
}

shopifyRouter.get("/auth", (req: Request, res: Response): Promise<void> => {
    const shop: string = req.query.shop as string;
    if (!shop) {
        res.status(400).json({ error: 'No shop provided' });
        return
    }
    
    const scopes = 'read_products,write_products';
    const state = generateRandomString(8);
    
    req.session.shopifyOAuthState = state;

    const authUrl = `https://${shop}.myshopify.com/admin/oauth/authorize` +
        `?client_id=${shopifyClientId}` +
        `&scope=${encodeURIComponent(scopes)}` +
        `&redirect_uri=${encodeURIComponent(shopifyRedirectUri)}` +
        `&state=${state}`;
    
    console.log('Redirecting URL: ', authUrl);

    res.redirect(authUrl);
});

shopifyRouter.get('/oauth2callback', async (req: Request, res: Response): Promise<void> => {
    const { shop, code, state } = req.query;
    
    if (state !== req.session.shopifyOAuthState) {
        res.status(403).json({ error: 'Invalid state parameter' });
        return
    }

    delete req.session.shopifyOAuthState;

    if (!shop || !code) {
        res.status(400).json({ error: 'Missing required parameters' });
        return
    }

    const clientId = shopifyClientId;
    const clientSecret = shopifyClientSecret;
    const tokenUrl = `https://${shop}/admin/oauth/access_token`;

    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
            }),
        });
        const data = await response.json();

        if (data.access_token) {
            // Save the access token for future API calls (e.g., in your database)
            res.json({ success: true, access_token: data.access_token });
            return
        } else {
            res.status(400).json({ error: 'Failed to fetch access token', details: data });
            return
        }
    } catch (err) {
        console.error('Error fetching access token:', err);
        res.status(500).json({ error: 'Internal server error' });
        return
    }
});

export default shopifyRouter;