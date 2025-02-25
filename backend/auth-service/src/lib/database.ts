import pg from 'pg'
import {databaseUrl} from "./config";

const { Pool, Client } = pg
const connectionString = databaseUrl

const pool = new Pool({
    connectionString,
})

const getClient = async () => {
    const client = new Client({ connectionString });
    await client.connect();
    return client;
};

const initializeDatabase = async () => {
    const client = await getClient();
    try {
        console.log("Initializing database...");
        // await client.query(`
        //     CREATE TABLE IF NOT EXISTS users (
        //         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        //         email VARCHAR(255) UNIQUE NOT NULL,
        //         password_hash TEXT, -- Only for non-Shopify users
        //         shopify_shop_id VARCHAR(255) UNIQUE, -- If Shopify user
        //         shopify_access_token TEXT, -- If Shopify user
        //         role VARCHAR(50) CHECK (role IN ('admin', 'merchant')),
        //         created_at TIMESTAMP DEFAULT NOW()
        //     );
        // `);
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                google_id VARCHAR(255) UNIQUE NOT NULL,
                access_token TEXT,
                refresh_token TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log("Database initialized: 'users' table created (if not exists).");
    } catch (error) {
        console.error("Error initializing database:", error);
        throw error;
    } finally {
        client.end();
    }
};

export const connect = async () => {
    try {
        const res = await pool.query("SELECT NOW()");
        console.log("Database connected at:", res.rows[0].now);
        await initializeDatabase()
    } catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
};

export { pool, getClient };