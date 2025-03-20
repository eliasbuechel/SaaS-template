import { Router, Request, Response } from "express";
import {decryptSessionData, encryptSessionData, generateRandomString} from "@/lib/encryption.js";
import {logRequests} from "@/middleware/logRequests.js";
import {redirectToErrorPage, setResponseWithErrorLog, setResponseWithWarnLog} from "@/utils/messageHandling.js";
import ENV from "@/lib/config/env.js";
import logger from "@/utils/logger.js";
import {IUser} from "@/interfaces/IUser.js";
import {createUser, getUserByGoogleId} from "@/lib/database/userRepo.js";
import {generateAccessToken, generateRefreshToken, setTokenOnResponse} from "@/lib/generateToken.js";

declare module 'express-session' {
    interface SessionData {
        googleOAuthState?: string;
    }
}

interface State {
    nonce: string,
    redirectUrlAfterAuth: string,
    redirectUrlAfterError: string,
}

interface UserInfo {
    sub: string,
    email: string,
}

const createEncryptedState = (redirectUrlAfterAuth: string, redirectUrlAfterError: string): string => {
    const state: State = {
        nonce: generateRandomString(16),
        redirectUrlAfterAuth,
        redirectUrlAfterError
    };
    return encryptSessionData(state);
};

const googleAuthRouter: Router = Router();

googleAuthRouter.get("/", logRequests, (req: Request, res: Response): void => {
    const { redirectUrlAfterAuth, redirectUrlAfterError } = req.query as { redirectUrlAfterAuth?: string, redirectUrlAfterError?: string };
    
    if (!redirectUrlAfterAuth) {
        setResponseWithErrorLog(res, 400, "Missing parameter redirectUrlAfterAuth");
        return;
    }

    if (!redirectUrlAfterError) {
        setResponseWithErrorLog(res, 400, "Missing parameter redirectUrlAfterError");
        return;
    }
    
    const encryptedState: string = createEncryptedState(redirectUrlAfterAuth, redirectUrlAfterError);
    req.session.googleOAuthState = encryptedState;
    
    const scopes = ['openid', 'profile', 'email'];
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${ENV.GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(ENV.GOOGLE_REDIRECT_URI)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent(scopes.join(' '))}` +
        `&state=${encodeURIComponent(encryptedState)}` +
        `&access_type=offline` +
        `&prompt=select_account`;

    console.log('Redirecting to Google OAuth URL: ', authUrl);
    res.redirect(authUrl);
});

const getGoogleOAuth2AccessToken = async (code: string): Promise<string | null> => {
    const tokenUrl: string = 'https://oauth2.googleapis.com/token';
    const response: globalThis.Response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            code: code as string,
            client_id: ENV.GOOGLE_CLIENT_ID!,
            client_secret: ENV.GOOGLE_CLIENT_SECRET!,
            redirect_uri: ENV.GOOGLE_REDIRECT_URI!,
            grant_type: 'authorization_code'
        })
    });

    const responseData = await response.json() as { access_token: string | null};
    return responseData.access_token;
};

const getGoogleOAuth2UserInfo = async (googleOAuthAccessToken: string): Promise<UserInfo> => {
    const userInfoResponse: globalThis.Response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${googleOAuthAccessToken}` }
    });
    const userInfo = await userInfoResponse.json();
    return userInfo as UserInfo;
};

googleAuthRouter.get("/oauth2callback", logRequests, async (req: Request, res: Response): Promise<void> => {
    const { code, state } = req.query as { code?: string; state?: string };

    try {
        if (!state) throw Error("State is undefined");
        
        const encryptedState = decodeURIComponent(state);
        if (encryptedState !== req.session.googleOAuthState) {
            setResponseWithWarnLog(res, 403, "Invalid state parameter", "State mismatch in OAuth callback");
            return;
        }
    } catch (error) {
        setResponseWithErrorLog(res, 400, "Invalid state parameter", "Failed to decode state parameter", error);
        return;
    }

    let stateData: State;
    try {
        stateData = decryptSessionData(req.session.googleOAuthState) as State;
        logger.info(`Successfully decrypted OAuth state`);
    } catch (error) {
        setResponseWithErrorLog(res, 400, "Invalid state parameter", "Error decrypting OAuth state", error);
        return;
    } finally {
        delete req.session.googleOAuthState;
    }

    if (!code) {
        res.status(400).json({ error: 'Missing code parameter' });
        return;
    }
    
    try {
        const googleOAuth2AccessToken : string | null = await getGoogleOAuth2AccessToken(code);
        if (!googleOAuth2AccessToken) {
            res.status(400).json({ error: "Failed to fetch access token" });
            return;
        }

        const userInfo: UserInfo = await getGoogleOAuth2UserInfo(googleOAuth2AccessToken);
        const user: IUser = await getUserByGoogleId(userInfo.sub) ?? await createUser(userInfo.sub, userInfo.email);
        
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user.id);

        setTokenOnResponse(res, "access_token", accessToken);
        setTokenOnResponse(res, "refresh_token", refreshToken);

        logger.info(`User ${user.email} authenticated. Redirecting to ${stateData.redirectUrlAfterAuth}`);
        res.redirect(stateData.redirectUrlAfterAuth);
    } catch (error: any) {
        redirectToErrorPage(req, res, stateData.redirectUrlAfterError, 500, "Internal server error", error);
    }
});

export default googleAuthRouter;