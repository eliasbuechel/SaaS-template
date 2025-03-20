import '@shopify/shopify-api/adapters/node';
import {Request, Response, Router} from "express";
import {verifyUser} from "@/middleware/verifyUser.js";
import {decryptSessionData, encryptSessionData, generateRandomString} from "@/lib/encryption.js";
import {logRequests} from "@/middleware/logRequests.js";
import {redirectToErrorPage, setResponseWithErrorLog, setResponseWithWarnLog} from "@/utils/messageHandling.js";
import logger from "@/utils/logger.js";
import {createOrUpdateTenant, existsTenantByTenantId} from "@/lib/database/tenantRepo.js";
import {verifyTenant} from "@/middleware/verifyTenant.js";
import {generateAccessToken, setTokenOnResponse} from "@/lib/generateToken.js";
import {verifyInternal} from "@/middleware/verifyInternal.js";
import {IUser} from "@/interfaces/IUser.js";
import {getUser} from "@/lib/database/userRepo.js";
import {ITenant} from "@/interfaces/ITenant.js";
import {updateAccessTokenForTenant} from "@/routes/auth/auth.js";
import {shopify} from "@/lib/shopify.js";
import {Session} from "@shopify/shopify-api";
import {redisShopifySessionStorage} from "@/lib/database/redisShopifySessionStorage.js";

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

shopifyAuthRouter.get("/", logRequests, verifyUser, logRequests, async (req: Request, res: Response): Promise<void> => {
    let shop: string | undefined = req.query.shop as string;
    const { redirectUrlAfterAuth, redirectUrlAfterError } = req.query as { redirectUrlAfterAuth?: string, redirectUrlAfterError?: string };

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

    const SHOP_ENDING: string = ".myshopify.com"
    if (!shop.endsWith(SHOP_ENDING)) {
        logger.warn(`Adding ending of ${SHOP_ENDING} to the shop ${shop} resulting in ${shop + SHOP_ENDING}`);
        shop = shop + SHOP_ENDING;
    }
    
    try {
        req.session.shopifyOAuthState = createEncryptedState(req.user.id, redirectUrlAfterAuth, redirectUrlAfterError);;
        
        return shopify.auth.begin({
            shop: shop,
            callbackPath: "/api/auth/shopify/oauth2callback",
            isOnline: false,
            rawRequest: req,
            rawResponse: res
        });
    } catch (error: any) {
        redirectToErrorPage(req, res, redirectUrlAfterError, 500, "Shopify OAuth start error", error);
    }
});

shopifyAuthRouter.get('/oauth2callback', logRequests, async (req: Request, res: Response): Promise<void> => {
    const callbackResponse = await shopify.auth.callback({
        rawRequest: req,
        rawResponse: res,
    });
    const session = callbackResponse.session;
    
    if (!session) {
        setResponseWithErrorLog(res, 400, "Invalid shopify oauth2callback response", "response does not contain a shopify session");
        return;
    }
    
    if (!await redisShopifySessionStorage.storeSession(session)) {
        setResponseWithErrorLog(res, 500, "Internal server error", "Not able to store shopify session");
        return;
    }

    let stateData: State;
    try {
        stateData = decryptSessionData(req.session.shopifyOAuthState!) as State;
        logger.info(`Successfully decrypted OAuth state for user: ${stateData.userId}`);
    } catch (error) {
        setResponseWithErrorLog(res, 400, "Invalid state parameter", "Error decrypting OAuth state", error);
        return;
    } finally {
        delete req.session.shopifyOAuthState;
    }

    try {
        const user: IUser | null = await getUser(stateData.userId);
        if (!user) {
            throw new Error("Not able to retrieve User " + stateData.userId);
        }

        const tenant: ITenant | null = await createOrUpdateTenant(stateData.userId, session.shop, session.id);
        if (!tenant) {
            throw new Error("Not able to retrieve tenant for the shop " + session.shop);
        }

        updateAccessTokenForTenant(res, user, tenant);

        logger.info(`Shopify store ${tenant.shopifyStoreDomain} connected for user ${user.email}`);
        res.redirect(stateData.redirectUrlAfterAuth);
    } catch (error: any) {
        redirectToErrorPage(req, res, stateData.redirectUrlAfterError, 500, "Shopify OAuth callback error", error);
    }
});

shopifyAuthRouter.post("/switch",logRequests, verifyUser, verifyTenant, async (req: Request, res: Response): Promise<void> => {
    const { tenantId } = req.body as { tenantId?: string };

    if (!tenantId) {
        setResponseWithWarnLog(res, 400, "No tenant id provided", "Missing tenantId parameter in request");
        return;
    }

    logger.debug("Valid tenant id to switch", tenantId);
    const tenantExists = await existsTenantByTenantId(req.user!.id, tenantId);

    logger.debug("Tenant exists", tenantExists);
    if (!tenantExists) {
        setResponseWithErrorLog(res, 400, "User does not own the specified tenant");
        return;
    }
    
    const accessToken = generateAccessToken(req.user!, tenantId);
    setTokenOnResponse(res, "access_token", accessToken);

    logger.debug("Access token generated and set");

    res.status(200).json({ success: true, tenantId: tenantId });
});

shopifyAuthRouter.get('/session', logRequests, verifyInternal, verifyUser, verifyTenant, async (req: Request, res: Response): Promise<void> => {
    const session: Session | undefined = await redisShopifySessionStorage.loadSession(req.tenant?.shopifySessionId!);
    
    if (!session) {
        setResponseWithErrorLog(res, 400, `Not able to load shopify session ${req.tenant?.shopifySessionId!}`);
        return;
    }

    logger.debug(`Sending following session: ${session}`);
    logger.debug(`session data access token: ${session.accessToken}`);

    res.json(session.toObject());
});

export default shopifyAuthRouter;