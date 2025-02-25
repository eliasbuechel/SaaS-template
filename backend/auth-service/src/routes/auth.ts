import {Router, Request, Response} from "express";
import {pool} from "../lib/database";

const authRouter: Router = Router();

authRouter.get('/status', async (req: Request, res: Response): Promise<void> => {
    const accessToken: string = req.cookies['access_token'];

    if (!accessToken) {
        res.status(401).send({ error: "Not authenticated" });
        return
    }

    try {
        const queryText = `
            SELECT google_id, access_token, refresh_token, created_at, updated_at
            FROM users
            WHERE access_token = $1
            LIMIT 1;
        `;
        const { rows } = await pool.query(queryText, [accessToken]);

        console.log(rows.length);
        
        if (rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return
        }

        // You might want to filter or transform the user data before sending it back
        const user = rows[0];
        res.json({ user });
    } catch (error) {
        console.error('Error querying user status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default authRouter;