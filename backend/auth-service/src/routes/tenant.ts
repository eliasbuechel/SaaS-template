import express, {Request, Response, Router} from "express";
import {logRequests} from "@/middleware/logRequests.js";
import {verifyUser} from "@/middleware/verifyUser.js";
import {verifyTenant} from "@/middleware/verifyTenant.js";
import Tenant from "@/types/Tenant.js";
import {mapTenantToFrontend} from "@/lib/mapper.js";
import {ITenant} from "@/interfaces/ITenant.js";
import {getAllTenants} from "@/lib/database/tenantRepo.js";
import {setResponseWithErrorLog} from "@/utils/messageHandling.js";

const tenantRouter: Router = express.Router();

tenantRouter.get("/", logRequests, verifyUser, verifyTenant, async (req: Request, res: Response): Promise<void> => {
    const tenant: Tenant = mapTenantToFrontend(req.tenant);
    res.json(tenant);
});

tenantRouter.get("/all", logRequests, verifyUser, verifyTenant, async (req: Request, res: Response): Promise<void> => {
    try {
        const queriedTenants: Array<ITenant> = await getAllTenants(req.user.id);
        const tenants: Array<Tenant> = queriedTenants.map<Tenant>(t => mapTenantToFrontend(t));
        res.json(tenants);
    } catch (error) {
        setResponseWithErrorLog(res, 500, "Internal server error", "Error while loading tenants", error);
    }
});

export default tenantRouter;