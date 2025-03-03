import pg from 'pg';
import {DATABASE_URL} from "../config";
import logger from "../../utils/logger";

const { Pool, Client } = pg
const connectionString = DATABASE_URL

const pool = new Pool({
    connectionString,
})

const getClient = async () => {
    const client = new Client({ connectionString });
    await client.connect();
    logger.info("Database client connected");
    return client;
};

const initializeDatabase = async () => {
    const client = await getClient();
    try {
        logger.info("Initializing database...");
        const start: number = Date.now();

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email TEXT UNIQUE NOT NULL,
                google_id TEXT UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT now(),
                updated_at TIMESTAMP DEFAULT now()
            );

            CREATE TABLE IF NOT EXISTS tenants (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                shopify_store_domain TEXT UNIQUE NOT NULL,
                shopify_access_token TEXT NOT NULL,
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT now(),
                updated_at TIMESTAMP DEFAULT now()
            );
        `);

        const timeTaken: number = Date.now() - start;
        logger.info(`Database initialized successfully in ${timeTaken}ms`);
    } catch (error) {
        logger.error("Error initializing database:", error);
        throw error;
    } finally {
        await client.end();
        logger.info("Database client connection closed");
    }
};

export const connect = async () => {
    try {
        const start = Date.now();

        const res = await pool.query("SELECT NOW()");
        logger.info(`Database connected at: ${res.rows[0].now}`);
        await initializeDatabase()

        const timeTaken = Date.now() - start;
        logger.info(`Database connection and setup completed in ${timeTaken}ms`);
    } catch (error) {
        logger.error("Database connection error:", error);
        throw error;
    }
};

export { pool, getClient };