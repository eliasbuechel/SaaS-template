import "express";

declare module "express-serve-static-core" {
    interface Request {
        shopifyStoreDomain?: string,
        shopifySessionId?: string
    }
}