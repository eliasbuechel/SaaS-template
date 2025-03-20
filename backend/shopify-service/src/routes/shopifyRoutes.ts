import {Request, Response, Router} from "express";
import {logRequests} from "../middleware/logRequests.js";
import {verifyShopifySession} from "@/middleware/verifyShopifySession.js";
import logger from "@/utils/logger.js";
import axios, {AxiosResponse, HttpStatusCode} from "axios";
import ENV from "@/lib/config/env.js";
import {setResponseWithErrorLog} from "@/utils/messageHandling.js";
import '@shopify/shopify-api/adapters/node';
import Shopify, {Session} from "@shopify/shopify-api";
import {shopify} from "@/lib/shopify.js";
import {Product} from "@/types/shopify/Product.js";

const shopifyRouter: Router = Router();

const getShopifySession = async (req: Request): Promise<Session | undefined> => {
    try {
        const response: AxiosResponse = await axios.get(`${ENV.INTERNAL_AUTH_SERVICE_URL}/api/auth/shopify/session`, {
            headers: {
                Authorization: `Bearer ${ENV.INTERNAL_AUTH_COMMUNICATION_SECRET}`,
                Cookie: req.headers.cookie || "",
            },
        });
        
        if (response.status !== HttpStatusCode.Ok) {
            logger.error(`Error while retrieving shopify session. Received response status ${response.status}`);
            return undefined;
        }
        
        const sessionData = response.data;
        logger.debug(`Received session data: ${sessionData}`);
        const session = new Session(sessionData.id);
        Object.assign(session, sessionData);
        
        return session;
    } catch (error) {
        logger.error(`Error while retrieving shopify session.`, error);
    }
    
    return undefined;
}

shopifyRouter.get('/products', logRequests, verifyShopifySession, async (req: Request, res: Response): Promise<void> => {
    const session: Session | undefined = await getShopifySession(req);
    if (!session) {
        setResponseWithErrorLog(res, 500, "Internal server error", "Not able to retrieve shopify session");
        return;
    }
    
    try {
        const client = new shopify.clients.Rest({session});
        const response: Shopify.RestRequestReturn  = await client.get({ path: "products" })
        
        const products: Product[] = response.body.products as Product[];
        // logger.debug(`Shopify products: ${JSON.stringify(products)}`);
        logger.debug(`Retrieved ${products?.length} products from shopify.`);
        if (products?.length > 0) logger.debug(`First product: ${JSON.stringify(products[0])}`)
        
        res.json({ products });
    } catch (error) {
        logger.error("Not able to retrieve products form shopify store", error);
        res.status(404).send("Not Found");
    }
});

export default shopifyRouter;