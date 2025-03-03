import {Response} from 'express';
import jwt, {JwtPayload} from "jsonwebtoken";
import {JWT_SECRET, JWT_REFRESH_SECRET, dev} from "../lib/config";
import {IUser} from "../interfaces/IUser";
import logger from "../utils/logger";

export interface AccessTokenPayload {
    userId: string;
    email: string;
    tenantId?: string;
}

export interface RefreshTokenPayload {
    userId: string
}

export const generateAccessToken = (user: IUser, tenantId?: string): string => {
    const payload = tenantId ? {
        userId: user.id,
        email: user.email,
        tenantId: tenantId
    } : {
        userId: user.id,
        email: user.email
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId: string): string => {
    const payload = { id: userId };
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

export const extractAccessTokenData = (accessToken: string): AccessTokenPayload | null => {
    try {
        return jwt.verify(accessToken, JWT_SECRET) as JwtPayload & AccessTokenPayload;
    } catch (error) {
        logger.error("Error extracting and verifying access token:", error.message);
        return null;
    }
}

export const extractRefreshTokenData = (refreshToken: string): RefreshTokenPayload | null => {
    try {
        return jwt.verify(refreshToken, JWT_REFRESH_SECRET) as JwtPayload & RefreshTokenPayload;
    } catch (error) {
        logger.error("Error extracting and verifying refresh token:", error);
        return null;
    }
}

export const setTokenOnResponse = (res: Response, tokenName: string, token: string) => {
    res.cookie(tokenName, token, { httpOnly: true, secure: !dev, sameSite: "lax" });
    logger.info(`Adding or updating ${tokenName}`);
}

export const setExpiredTokenOnResponse = (res: Response, tokenName: string) => {
    res.cookie(tokenName, "", { httpOnly: true, secure: !dev, sameSite: "lax", expires: new Date(0), path: "/" });
    logger.info(`Token ${tokenName} has been expired and removed.`);
}