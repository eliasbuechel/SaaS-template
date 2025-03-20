import {ApiVersion, LogSeverity, Shopify, shopifyApi} from "@shopify/shopify-api";
import ENV from "@/lib/config/env.js";
import {DEV} from "@/lib/config/baseEnv.js";
import logger from "@/utils/logger.js";
import {restResources} from "@shopify/shopify-api/rest/admin/2025-01";

const logLevelMap = {
    [LogSeverity.Error]: "error",
    [LogSeverity.Warning]: "warn",
    [LogSeverity.Info]: "info",
    [LogSeverity.Debug]: "debug",
} as const;

// see docs: https://github.com/Shopify/shopify-app-js/blob/main/packages/apps/shopify-api/docs/reference/shopifyApi.md
export const shopify: Shopify = shopifyApi({
    _logDisabledFutureFlags: false,
    // adminApiAccessToken: "",
    apiKey: ENV.SHOPIFY_CLIENT_ID,
    apiSecretKey: ENV.SHOPIFY_CLIENT_SECRET,
    apiVersion: ApiVersion.January25,
    // billing: {
    //     'My plan': {
    //         amount: 5.0,
    //         currencyCode: 'USD',
    //         interval: BillingInterval.OneTime,
    //     },
    // },
    customShopDomains: [],
    future: undefined,
    hostName: ENV.HOST_NAME,
    hostScheme: DEV && !ENV.HOST_NAME.endsWith(".ngrok-free.app") ? "http" : "https",
    isCustomStoreApp: false,
    isEmbeddedApp: false,
    isTesting: true,
    logger: {
        log: (severity, msg) => logger.log(logLevelMap[severity], msg),
        level: DEV ? LogSeverity.Debug : LogSeverity.Info
    },
    // privateAppStorefrontAccessToken: "",
    restResources: restResources,
    scopes: ["read_products", "write_products"],
    // userAgentPrefix: "",
    // sessionStorage: undefined
});