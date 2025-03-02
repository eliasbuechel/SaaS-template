import {Router, Request, Response} from "express";
import {SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET, SHOPIFY_REDIRECT_URI} from "../../lib/config";
import {verifyUser} from "../../middleware/verifyUser";
import logger from "../../utils/logger";
import {decryptSessionData, encryptSessionData, encryptToken, generateRandomString} from "../../utils/encryption";
import {ITenant} from "../../interfaces/ITenant";
import {getTenantByShopifyStoreDomainOrUpdate, getUserById} from "../../lib/database";
import {constructAccessTokenData, generateAccessToken, setTokenOnResponse} from "../../utils/generateToken";
import {logRequests} from "../../middleware/logRequests";
import {redirectToErrorPage, setResponseWithErrorLog, setResponseWithWarnLog} from "../../utils/messageHandling";
import {updateAccessTokenForTenant} from "./auth";

const shopifyAuthRouter: Router = Router();

declare module 'express-session' {
    interface SessionData {
        shopifyOAuthState?: string;
    }
}

interface State {
    nonce: string,
    userId: string,
    redirectUrlAfterAuth: string,
    redirectUrlAfterError: string
}

const createEncryptedState = (userId: string, redirectUrlAfterAuth: string, redirectUrlAfterError: string): string => {
    const state: State = {
        userId,
        nonce: generateRandomString(16),
        redirectUrlAfterAuth,
        redirectUrlAfterError
    };
    return encryptSessionData(state);
};

shopifyAuthRouter.get("/", verifyUser, logRequests, (req: Request, res: Response): Promise<void> => {
    const { shop, redirectUrlAfterAuth, redirectUrlAfterError } = req.query as {shop?: string, redirectUrlAfterAuth?: string, redirectUrlAfterError?: string };

    if (!shop) {
        setResponseWithWarnLog(res, 400, "No shop provided", "Missing shop parameter in request");
        return;
    }

    if (!redirectUrlAfterAuth) {
        setResponseWithWarnLog(res, 400, "Missing redirectUrlAfterAuth query parameter");
        return;
    }

    if (!redirectUrlAfterError) {
        setResponseWithWarnLog(res, 400, "Missing redirectUrlAfterError query parameter");
        return;
    }

    if (!req.user) {
        setResponseWithWarnLog(res, 400, "Unauthorized request", "No user attached to session");
        return;
    }
    
    const encryptedState: string = createEncryptedState(req.user.id, redirectUrlAfterAuth, redirectUrlAfterError);
    req.session.shopifyOAuthState = encryptedState;

    const scopes = 'write_products';
    const authUrl = `https://${shop}.myshopify.com/admin/oauth/authorize` +
        `?client_id=${SHOPIFY_CLIENT_ID}` +
        `&scope=${encodeURIComponent(scopes)}` +
        `&redirect_uri=${encodeURIComponent(SHOPIFY_REDIRECT_URI)}` +
        `&state=${encodeURIComponent(encryptedState)}`;

    logger.info(`Generated Shopify auth URL for shop: ${shop}`);
    res.json({ redirectUrl: authUrl });
});

shopifyAuthRouter.get('/oauth2callback', logRequests, async (req: Request, res: Response): Promise<void> => {
    const { shop, code, state } = req.query as { shop?: string; code?: string; state?: string };

    if (!state || !req.session.shopifyOAuthState) {
        setResponseWithErrorLog(res, 403, "Invalid state parameter", "Missing state parameter in OAuth callback")
        return;
    }

    try {
        const encryptedState = decodeURIComponent(state);
        if (encryptedState !== req.session.shopifyOAuthState) {
            setResponseWithWarnLog(res, 403, "Invalid state parameter", "State mismatch in OAuth callback")
            return;
        }
    } catch (error) {
        setResponseWithErrorLog(res, 400, "Invalid state parameter", "Failed to decode state parameter", error)
        return;
    }

    let stateData: State;
    try {
        stateData = decryptSessionData(req.session.shopifyOAuthState) as State;
        logger.info(`Successfully decrypted OAuth state for user: ${stateData.userId}`);
    } catch (error) {
        setResponseWithErrorLog(res, 400, "Invalid state parameter", "Error decrypting OAuth state", error)
        return;
    } finally {
        delete req.session.shopifyOAuthState;
    }

    if (!shop || !code) {
        setResponseWithErrorLog(res, 400, "Missing required parameters", "Missing required parameters in OAuth callback")
        return;
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

        if (!response.ok) {
            setResponseWithErrorLog(res, 400, "Failed to get access token from Shopify", `Shopify API responded with status ${response.status}`);
            return;
        }
        
        const data = await response.json();
        if (!data.access_token) {
            setResponseWithWarnLog(res, 400, "Failed to get access token from Shopify", "Shopify response did not contain an access token");
            return;
        }

        const encryptedShopifyAccessToken = encryptToken(data.access_token);
        const tenant: ITenant = await getTenantByShopifyStoreDomainOrUpdate(shop, encryptedShopifyAccessToken, stateData.userId);

        if (!tenant) {
            throw new Error("Not able to retrieve tenant for the shop " + shop)
        }

        const user = await getUserById(stateData.userId);
        if (!user) {
            throw new Error("Not able to retrieve User " + stateData.userId)
        }
        
        updateAccessTokenForTenant(res, user, tenant);
        
        logger.info(`Shopify store ${tenant.shopifyStoreDomain} connected for user ${user.email}`);
        res.redirect(stateData.redirectUrlAfterAuth);
    } catch (error) {
        redirectToErrorPage(req, res, stateData.redirectUrlAfterError, 500, "Internal server error", error);
    }
});

export default shopifyAuthRouter;