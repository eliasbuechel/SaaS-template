import express, {Request, Response, Router} from "express";
import { verifyTenant } from "../middleware/verifyTenant";
import {verifyUser} from "../middleware/verifyUser";
import {logRequests} from "../middleware/logRequests";
import {mapTenantToFrontend} from "../utils/mapper";
import Tenant from "../types/Tenant";
import {getAllTenantsOfUserByUserId} from "../lib/database";
import {setResponseWithErrorLog} from "../utils/messageHandling";
import {ITenant} from "../interfaces/ITenant";

const tenantRouter: Router = express.Router();

tenantRouter.get("/", logRequests, verifyUser, verifyTenant, async (req: Request, res: Response): Promise<void> => {
    const tenant: Tenant = mapTenantToFrontend(req.tenant)
    res.json(tenant);
});

tenantRouter.get("/all", logRequests, verifyUser, verifyTenant, async (req: Request, res: Response): Promise<void> => {
    try {
        const queriedTenants: Array<ITenant> = await getAllTenantsOfUserByUserId(req.user.id);
        const tenants: Array<Tenant> = queriedTenants.map<Tenant>(t => mapTenantToFrontend(t))
        res.json(tenants);
    } catch (error) {
        setResponseWithErrorLog(res, 500, "Internal server error", "Error while loading tenants", error);
    }
});

export default tenantRouter;