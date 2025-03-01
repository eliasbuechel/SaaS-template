import { Router, Request, Response } from "express";
import {addUserWithGoogleIdAndEmail, getUserByGoogleId} from "../lib/database";
import {dev, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI} from "../lib/config";
import {IUser} from "../interfaces/IUser";
import logger from "../utils/logger";
import {generateAccessToken, generateRefreshToken} from "../utils/generateToken";
import {generateRandomString} from "../utils/encryption";

const googleRouter: Router = Router();

googleRouter.get("/auth", (req: Request, res: Response): void => {
    const state = generateRandomString(8);
    req.session.googleOAuthState = state;

    const scopes = ['openid', 'profile', 'email'];
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent(scopes.join(' '))}` +
        `&state=${state}` +
        `&access_type=offline`;

    console.log('Redirecting to Google OAuth URL: ', authUrl);
    res.redirect(authUrl);
});

googleRouter.get("/oauth2callback", async (req: Request, res: Response): Promise<void> => {
    const { code, state } = req.query;

    if (state !== req.session.googleOAuthState) {
        logger.warn("Invalid state parameter for Google OAuth");
        res.status(403).json({ error: 'Invalid state parameter' });
        return;
    }
    delete req.session.googleOAuthState;

    if (!code) {
        res.status(400).json({ error: 'Missing code parameter' });
        return;
    }
    
    try {
        const tokenUrl: string = 'https://oauth2.googleapis.com/token';
        const response: globalThis.Response = await fetch(tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code: code as string,
                client_id: GOOGLE_CLIENT_ID!,
                client_secret: GOOGLE_CLIENT_SECRET!,
                redirect_uri: GOOGLE_REDIRECT_URI!,
                grant_type: 'authorization_code'
            })
        });
        
        const responseData = await response.json();
        if (!responseData.access_token) {
            res.status(400).json({ error: "Failed to fetch access token" });
            return
        }

        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${responseData.access_token}` }
        });
        const userInfo = await userInfoResponse.json();

        const user: IUser = await getUserByGoogleId(userInfo.sub) ?? await addUserWithGoogleIdAndEmail(userInfo.sub, userInfo.email)
        
        let accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user.id);

        res.cookie("access_token", accessToken, { httpOnly: true, secure: !dev, sameSite: "lax" });
        res.cookie("refresh_token", refreshToken, { httpOnly: true, secure: !dev, sameSite: "lax" });

        logger.info(`User ${user.email} authenticated. Redirecting to Connect Shopify.`);
        res.redirect("http://localhost:3000/dashboard");
    } catch (error) {
        console.error("Google OAuth Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default googleRouter;
