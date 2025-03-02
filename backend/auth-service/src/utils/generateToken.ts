import {Response} from 'express';
import jwt, {JwtPayload} from "jsonwebtoken";
import {JWT_SECRET, JWT_REFRESH_SECRET, dev} from "../lib/config";
import logger from "./logger";
import {IUser} from "../interfaces/IUser";

export interface AccessTokenData { user: { id: string; email: string }, tenantId?: string }
export interface RefreshTokenData { id: string }

export const constructAccessTokenData = (user: IUser, tenantId?: string): AccessTokenData => {
    return { user: { id: user.id, email: user.email }, tenantId: tenantId };
}

export const generateAccessToken = (accessTokenData: AccessTokenData): string => {
    const payload = accessTokenData.tenantId
        ? { id: accessTokenData.user.id, email: accessTokenData.user.email, tenant_id: accessTokenData.tenantId }
        : { id: accessTokenData.user.id, email: accessTokenData.user.email };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

export const extractAccessTokenData = (accessToken: string): AccessTokenData | null => {
    try {
        const decoded = jwt.verify(accessToken, JWT_SECRET) as JwtPayload & {
            id: string;
            email: string;
            tenant_id?: string;
        };

        return {
            user: {
                id: decoded.id,
                email: decoded.email,
            },
            tenantId: decoded.tenant_id,
        };
    } catch (error) {
        logger.error("Error extracting and verifying access token:", error.message);
        return null;
    }
}

export const extractRefreshTokenData = (refreshToken: string): RefreshTokenData | null => {
    try {
        return jwt.verify(refreshToken, JWT_REFRESH_SECRET) as JwtPayload & RefreshTokenData;
    } catch (error) {
        logger.error("Error extracting and verifying refresh token:", error);
        return null;
    }
}

export const setTokenOnResponse = (res: Response, tokenName: string, token: string) => {
    res.cookie(tokenName, token, { httpOnly: true, secure: !dev, sameSite: "lax" });
    logger.info(`Adding or updating ${tokenName}`);
}