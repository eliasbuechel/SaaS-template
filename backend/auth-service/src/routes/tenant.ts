import express, {Request, Response, Router} from "express";
import { verifyTenant } from "../middleware/verifyTenant";
import {getTenantByUserId} from "../lib/database";
import {ITenant} from "../interfaces/ITenant";
import {decodeToken} from "../middleware/decodeToken";
import {verifyUser} from "../middleware/verifyUser";

const tenantRouter: Router = express.Router();

tenantRouter.get("/tenant", decodeToken, verifyUser,  verifyTenant, async (req: Request, res: Response): Promise<void> => {
    try {
        const tenant: ITenant | null = await getTenantByUserId(req.user.id);
        if (!tenant) {
            res.status(404).json({ error: "No Shopify store connected." });
            return
        }
        res.json(tenant);
    } catch (error) {
        console.error("Error fetching tenant:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default tenantRouter;

