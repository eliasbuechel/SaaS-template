import * as crypto from "node:crypto";
import { Router, Request, Response } from "express";
import {pool} from "../lib/database";
import {dev, googleClientId, googleRedirectSecret, googleRedirectUri} from "../lib/config";

const googleRouter: Router = Router();

function generateRandomString(length = 64) {
    return crypto.randomBytes(length).toString('hex');
}

googleRouter.get("/auth", (req: Request, res: Response): void => {
    const state = generateRandomString(8);
    req.session.googleOAuthState = state;

    const scopes = ['openid', 'profile', 'email'];
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${googleClientId}` +
        `&redirect_uri=${encodeURIComponent(googleRedirectUri)}` +
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
        res.status(403).json({ error: 'Invalid state parameter' });
        return;
    }
    delete req.session.googleOAuthState;

    if (!code) {
        res.status(400).json({ error: 'Missing code parameter' });
        return;
    }
    
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code: code as string,
                client_id: googleClientId!,
                client_secret: googleRedirectSecret!,
                redirect_uri: googleRedirectUri!,
                grant_type: 'authorization_code'
            })
        });
        const responseData = await response.json();

        if (responseData.access_token) {
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${responseData.access_token}` }
            });
            const userInfo = await userInfoResponse.json();

            const query = `
                INSERT INTO users (google_id, access_token, refresh_token)
                VALUES ($1, $2, $3)
                ON CONFLICT (google_id)
                DO UPDATE SET access_token = EXCLUDED.access_token,
                              refresh_token = EXCLUDED.refresh_token,
                              updated_at = NOW()
                RETURNING *;
            `;

            const values = [userInfo.sub, responseData.access_token, responseData.refresh_token];

            const result = await pool.query(query, values);
            console.log("Stored user in DB:", result.rows[0]);

            res.cookie('access_token', responseData.access_token, {
                httpOnly: true,
                secure: !dev,
                sameSite: 'lax' // Adjust according to your requirements
            });
            res.cookie('refresh_token', responseData.refresh_token, {
                httpOnly: true,
                secure: !dev,
                sameSite: 'lax'
            });

            res.redirect('http://localhost:3000/dashboard');
            return;
        } else {
            res.status(400).json({ error: 'Failed to fetch access token', details: responseData });
            return;
        }
    } catch (err) {
        console.error('Error fetching access token:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
});

export default googleRouter;
