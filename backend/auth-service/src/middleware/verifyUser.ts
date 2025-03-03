import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import {setResponseWithWarnLog} from "../utils/messageHandling";
import {
    AccessTokenData,
    constructAccessTokenData, extractAccessTokenData,
    extractRefreshTokenData,
    generateAccessToken,
    RefreshTokenData, setTokenOnResponse
} from "../utils/generateToken";
import {getFirstTenantByUserId, getUserById, hasUserExactlyOneTenant} from "../lib/database";

export const verifyUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let accessToken: string = req.cookies["access_token"] as string;
    const refreshToken: string = req.cookies["refresh_token"] as string;
    
    if (!accessToken) {
        if (!refreshToken) {
            setResponseWithWarnLog(res, 401, "Unauthorized", "No access or refresh token provided");
            return;
        }

        const refreshTokenData: RefreshTokenData | null = extractRefreshTokenData(refreshToken);
        if (!refreshTokenData) {
            setResponseWithWarnLog(res, 401, "Unauthorized", "Invalid refresh token provided");
            return;
        }
        
        req.user = await getUserById(refreshTokenData.id);
        if (!req.user) {
            setResponseWithWarnLog(res, 401, "Unauthorized", "User not found based on the refresh token");
            return;
        }
        
        if (await hasUserExactlyOneTenant(req.user.id)) {
            req.tenant = await getFirstTenantByUserId(req.user.id);
            accessToken = generateAccessToken(constructAccessTokenData(req.user, req.tenant.id))
        } else {
            accessToken = generateAccessToken(constructAccessTokenData(req.user))
        }
        
        setTokenOnResponse(res, "access_token", accessToken);
    }
    
    if (!req.user) {
        const accessTokenData: AccessTokenData | null = extractAccessTokenData(accessToken);
        
        if (!accessTokenData) {
            setResponseWithWarnLog(res, 401, "Unauthorized", "Invalid access token provided");
            return;
        }
        
        req.user = await getUserById(accessTokenData.user.id);
        
        if (!req.user) {
            setResponseWithWarnLog(res, 401, "Unauthorized", "User not found based on the access token");
            return;
        }
        
        if (!req.tenant && accessTokenData.tenantId) {
            req.tenant = await getFirstTenantByUserId(req.user.id);
            
            if (!req.tenant) {
                setResponseWithWarnLog(res, 403, "Authorization failed", "Tenant not found based on the access token");
                return;
            }
        }
    }

    logger.info(`Successfully verified user ${req.user.email} with JWT access token`);
    next();
};