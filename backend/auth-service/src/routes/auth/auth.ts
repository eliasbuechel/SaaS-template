import {Router, Request, Response} from "express";
import {getAllTenantsOfUserByUserId, getUserById} from "../../lib/database";
import {logRequests} from "../../middleware/logRequests";
import {verifyUser} from "../../middleware/verifyUser";
import {IUser} from "../../interfaces/IUser";
import {ITenant} from "../../interfaces/ITenant";
import User from "../../types/User";
import {mapTenantToFrontend, mapUserToFrontend} from "../../utils/mapper";
import Tenant from "../../types/Tenant";
import logger from "../../utils/logger";
import jwt from "jsonwebtoken";
import {dev, JWT_REFRESH_SECRET} from "../../lib/config";
import {
    constructAccessTokenData,
    generateAccessToken,
    generateRefreshToken,
    setTokenOnResponse
} from "../../utils/generateToken";
import {setResponseWithWarnLog} from "../../utils/messageHandling";

const authRouter: Router = Router();

export const updateAccessTokenForTenant = (res: Response, user: IUser, tenant: ITenant): void => {
    const accessToken: string = generateAccessToken(constructAccessTokenData(user, tenant.id));
    setTokenOnResponse(res, "access_token", accessToken);
}

authRouter.get('/status', logRequests, verifyUser, async (req: Request, res: Response): Promise<void> => {
    try {
        const tenants: ITenant[] = await getAllTenantsOfUserByUserId(req.user.id);
        
        if (tenants.length === 0) {
            setResponseWithWarnLog(res, 403, `No tenant for user ${req.user.email} found`)
            return;
        }
        
        if (!req.tenant) {
            req.tenant = tenants[0];
            updateAccessTokenForTenant(res, req.user, req.tenant);
        }
        
        const frontendUser: User = mapUserToFrontend(req.user)
        const frontendTenants: Array<Tenant> = tenants.map(t => mapTenantToFrontend(t));
        const frontendTenant: Tenant | null = req.tenant ? mapTenantToFrontend(req.tenant) : null;
        
        res.json({ user: frontendUser, tenants: frontendTenants, tenant: frontendTenant });
    } catch (error) {
        logger.error('Error querying user status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

authRouter.post("/refresh", logRequests, async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies["refresh_token"];

    if (!refreshToken) {
        logger.warn("Refresh token missing.");
        res.status(401).json({ error: "Refresh token required" });
        return;
    }

    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string; };

        const user = await getUserById(decoded.id);
        if (!user) {
            logger.warn(`Refresh failed - User ${decoded.id} not found.`);
            res.status(401).json({ error: "User not found" });
            return
        }
        
        const tenants: Array<ITenant> = await getAllTenantsOfUserByUserId(user.id);
        const tenantId = req.body.tenant_id as string | undefined;
        
        let selectedTenantId: string | undefined = undefined;
        if (tenantId) {
            const tenantExists = tenants.some(tenant => tenant.id === tenantId);
            if (!tenantExists) {
                logger.warn(`Invalid tenant selection for user ${user.id}: ${tenantId}`);
                res.status(403).json({ error: "Invalid tenant" });
                return
            }
            selectedTenantId = tenantId;
        } else if (tenants.length === 1) {
            selectedTenantId = tenants[0].id;
        }
        
        const newAccessToken = generateAccessToken(constructAccessTokenData(user, selectedTenantId));
        const newRefreshToken = generateRefreshToken(user.id);
        
        res.cookie("access_token", newAccessToken, {httpOnly: true, secure: !dev, sameSite: "lax",});
        res.cookie("refresh_token", newRefreshToken, {httpOnly: true, secure: !dev, sameSite: "lax",});

        logger.info(`Token refreshed successfully for user ${user.id}. Selected tenant: ${selectedTenantId ?? "None"}`);

        const frontendTenants = tenants.map(t => mapTenantToFrontend(t));
        res.json({accessToken: newAccessToken, tenants: frontendTenants});
    } catch (error) {
        logger.warn(`Refresh token verification failed: ${error.message}`);
        res.status(403).json({ error: "Invalid or expired refresh token" });
    }
});

export default authRouter;