import * as session from 'express-session';

declare module 'express-session' {
    interface SessionData {
        // googleOAuthState?: string;
        // shopifyOAuthState?: { state: string, redirectUrlAfterAuth: string };
    }
}

declare module 'express-serve-static-core' {
    interface Request {
        session: session.Session & Partial<session.SessionData>;
    }
}
