import {Session} from "express-session";
import {ApiVersion, LogSeverity, shopifyApi} from "@shopify/shopify-api";
import ENV from "@/lib/config/env.js";
import {restResources} from "@shopify/shopify-api/rest/admin/2025-01";
import logger from "@/utils/logger.js";
import {DEV} from "@/lib/config/baseEnv.js";

const logLevelMap = {
    [LogSeverity.Error]: "error",
    [LogSeverity.Warning]: "warn",
    [LogSeverity.Info]: "info",
    [LogSeverity.Debug]: "debug",
} as const;

export const shopify = shopifyApi({
    apiKey: ENV.SHOPIFY_CLIENT_ID,
    apiSecretKey: ENV.SHOPIFY_CLIENT_SECRET,
    apiVersion: ApiVersion.January25,
    scopes: ["read_products"],
    hostName: ENV.HOST_NAME,
    isEmbeddedApp: false,
    restResources: restResources,
    logger: {
        log: (severity, msg) => logger.log(logLevelMap[severity], msg),
        level: DEV ? LogSeverity.Debug : LogSeverity.Info
    },
});

// export type Product = typeof shopify.rest.Product;

export const getShopifyProducts = async (_shopifySession: Session): Promise<void> => {
    // const product: Product = new Product("");
    // const sessionId = await shopify.session.getCurrentId({
    //     rawRequest: undefined,
    //     rawResponse: undefined,
    //     isOnline: false
    // });
    //
    // const products = await shopify.rest.Products(shopifySession);
    //
    // const shopifyAuth = shopify.clients.Rest;
    //
    //
    // const url = `https://${shopifyStoreDomain}/admin/api/2023-07/products.json`;
    //
    // try {
    //     const response = await axios.get(url, {
    //         headers: {
    //             "X-Shopify-Access-Token": accessToken,
    //             "Content-Type": "application/json",
    //         }
    //     });
    //     return response.data.products;
    // } catch (error: any) {
    //     console.error("Error fetching products from Shopify:", error.message);
    //     throw new Error("Failed to fetch products from Shopify");
    // }
};
