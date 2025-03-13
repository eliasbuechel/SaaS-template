import "express";

declare module "express-serve-static-core" {
    interface Request {
        shopifyStoreDomain?: string,
        accessToken?: string
    }
}