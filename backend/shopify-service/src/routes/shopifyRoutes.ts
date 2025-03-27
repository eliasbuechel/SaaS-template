import { Request, Response, Router } from "express";
import { logRequests } from "../middleware/logRequests.js";
import { verifyShopifySession } from "@/middleware/verifyShopifySession.js";
import logger from "@/utils/logger.js";
import "@shopify/shopify-api/adapters/node";
import Shopify, { Session } from "@shopify/shopify-api";
import { shopify } from "@/lib/shopify.js";
import { Product } from "@/types/shopify/Product.js";
import { setResponseWithErrorLog } from "@/utils/messageHandling.js";

const shopifyRouter: Router = Router();

shopifyRouter.get(
  "/products",
  logRequests,
  verifyShopifySession,
  async (req: Request, res: Response): Promise<void> => {
    const session: Session | undefined = req.shopifySession;
    if (!session) {
      setResponseWithErrorLog(
        res,
        500,
        "Internal server error",
        "Not able to retrieve shopify session",
      );
      return;
    }

    try {
      const client = new shopify.clients.Rest({ session: req.shopifySession! });
      const response: Shopify.RestRequestReturn = await client.get({
        path: "products",
      });

      const products: Product[] = response.body.products as Product[];
      // logger.debug(`Shopify products: ${JSON.stringify(products)}`);
      logger.debug(`Retrieved ${products?.length} products from shopify.`);
      // if (products?.length > 0) logger.debug(`First product: ${JSON.stringify(products[0])}`)

      res.json({ products });
    } catch (error) {
      logger.error("Not able to retrieve products form shopify store.", error);
      res.status(404).send("Not Found.");
    }
  },
);

export default shopifyRouter;
