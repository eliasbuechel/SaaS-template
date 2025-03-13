import {Router, Request, Response} from "express";
import logger from "../utils/logger.js";

const shopifyRouter: Router = Router();

shopifyRouter.get('/orders', async (req: Request, res: Response) => {
    try {
        const cookies = req.headers.cookie;

        const response = await fetch("https://auth-service/api/auth/validate", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Cookie": cookies || ""
            }
        });
        
        if (!response.ok) {
            logger.error("Invalid credentials to request data from shopify");
            res.status(401).send("Not authorized");
            return;
        }

        const authData = await response.json();
        console.log(authData);
    } catch (error: any) {
        logger.error("Error fetching products from Shopify:", error.message);
    }
});