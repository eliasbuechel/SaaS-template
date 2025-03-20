import { Request, Response, NextFunction } from "express";
import {setResponseWithWarnLog} from "@/utils/messageHandling.js";
import {
    AccessTokenPayload, extractAccessTokenData,
    extractRefreshTokenData,
    generateAccessToken,
    RefreshTokenPayload,
    setTokenOnResponse
} from "@/lib/generateToken.js";
import {getUser} from "@/lib/database/userRepo.js";
import {getOnlyTenant, getTenant, getTenantCount} from "@/lib/database/tenantRepo.js";
import logger from "@/utils/logger.js";

export const verifyUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let accessToken: string = req.cookies["access_token"] as string;
    const refreshToken: string = req.cookies["refresh_token"] as string;
    
    if (!accessToken) {
        if (!refreshToken) {
            setResponseWithWarnLog(res, 401, "Unauthorized", "No access or refresh token provided");
            return;
        }

        const refreshTokenData: RefreshTokenPayload | null = extractRefreshTokenData(refreshToken);
        if (!refreshTokenData) {
            setResponseWithWarnLog(res, 401, "Unauthorized", "Invalid refresh token provided");
            return;
        }
        
        req.user = await getUser(refreshTokenData.userId);
        if (!req.user) {
            setResponseWithWarnLog(res, 401, "Unauthorized", "User not found based on the refresh token");
            return;
        }
        
        let hasExactlyOneTenant: boolean;
        try {
            const count: number = await getTenantCount(req.user.id);
            hasExactlyOneTenant = count === 1;
        } catch (error) {
            logger.error("Not able to check if exactly one tenant exists", error);
            hasExactlyOneTenant = false;
        }

        if (hasExactlyOneTenant) {
            try {
                req.tenant = await getOnlyTenant(req.user.id);
            } catch (error) {
                logger.error("Not able to get only tenant", error);
            }
        }

        accessToken = generateAccessToken(req.user, req.tenant?.id);
        setTokenOnResponse(res, "access_token", accessToken);
    }
    
    if (!req.user) {
        const accessTokenData: AccessTokenPayload | null = extractAccessTokenData(accessToken);
        
        if (!accessTokenData) {
            setResponseWithWarnLog(res, 401, "Unauthorized", "Invalid access token provided");
            return;
        }
        
        req.user = await getUser(accessTokenData.userId);
        
        if (!req.user) {
            setResponseWithWarnLog(res, 401, "Unauthorized", "User not found based on the access token");
            return;
        }
        
        if (!req.tenant && accessTokenData.tenantId) {
            try {
                req.tenant = await getTenant(req.user.id, accessTokenData.tenantId);
            } catch (error) {
                logger.error("Not able to get tenant based on access token data", error);
            }
            
            if (!req.tenant) {
                setResponseWithWarnLog(res, 403, "Authorization failed", "Tenant not found based on the access token");
                return;
            }
        }
    }

    logger.info(`Successfully verified user ${req.user.email} with JWT access token`);
    next();
};