import {Router, Request, Response} from "express";
import {generateAccessToken, setExpiredTokenOnResponse, setTokenOnResponse} from "@/lib/generateToken.js";
import {IUser} from "@/interfaces/IUser.js";
import {ITenant} from "@/interfaces/ITenant.js";
import {logRequests} from "@/middleware/logRequests.js";
import {verifyUser} from "@/middleware/verifyUser.js";
import {getAllTenants} from "@/lib/database/tenantRepo.js";
import {setResponseWithWarnLog} from "@/utils/messageHandling.js";
import User from "@/types/User.js";
import {mapTenantToFrontend, mapUserToFrontend} from "@/lib/mapper.js";
import Tenant from "@/types/Tenant.js";
import logger from "@/utils/logger.js";

const authRouter: Router = Router();

export const updateAccessTokenForTenant = (res: Response, user: IUser, tenant: ITenant): void => {
    const accessToken: string = generateAccessToken(user, tenant.id);
    setTokenOnResponse(res, "access_token", accessToken);
};

authRouter.get('/status', logRequests, verifyUser, async (req: Request, res: Response): Promise<void> => {
    try {
        const tenants: ITenant[] = await getAllTenants(req.user.id);
        
        if (tenants.length === 0) {
            setResponseWithWarnLog(res, 403, `No tenant for user ${req.user.email} found`);
            return;
        }
        
        if (!req.tenant) {
            req.tenant = tenants[0];
            updateAccessTokenForTenant(res, req.user, req.tenant);
        }
        
        const frontendUser: User = mapUserToFrontend(req.user);
        const frontendTenants: Array<Tenant> = tenants.map(t => mapTenantToFrontend(t));
        const frontendTenant: Tenant | null = req.tenant ? mapTenantToFrontend(req.tenant) : null;
        
        res.json({ user: frontendUser, tenants: frontendTenants, tenant: frontendTenant });
    } catch (error) {
        logger.error('Error querying user status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

authRouter.delete('/logout', async (_req: Request, res: Response): Promise<void> => {
    setExpiredTokenOnResponse(res, "access_token");
    setExpiredTokenOnResponse(res, "refresh_token");

    logger.info("User logged out, tokens expired.");
    res.status(200).json({ message: "Logged out successfully" });
});

export default authRouter;