import "express";
import {Session} from "@shopify/shopify-api";

declare module "express-serve-static-core" {
    interface Request {
        shopifySession?: Session;
    }
}