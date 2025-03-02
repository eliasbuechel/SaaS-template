import pg, {QueryResult} from 'pg'
import {DATABASE_URL} from "./config";
import {ITenant} from "../interfaces/ITenant";
import {IUser} from "../interfaces/IUser";
import logger from "../utils/logger";

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
                user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE, -- 1:1 Relationship for now
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

const queryLogger = async (query: string, params: any[]) => {
    const start = Date.now();
    try {
        const result = await pool.query(query, params);
        const timeTaken = Date.now() - start;
        logger.debug(`SQL Query Executed: ${query} - Time taken: ${timeTaken}ms`);
        return result;
    } catch (error) {
        logger.error(`SQL Query Failed: ${query} - Error: ${error.message}`);
        throw error;
    }
};

const mapFirstUserFromQuery = (usersQueryResult: QueryResult): IUser | null  => {
    if (usersQueryResult.rows.length === 0) return null;
    
    return {
        id: usersQueryResult.rows[0].id,
        email: usersQueryResult.rows[0].email,
        googleId: usersQueryResult.rows[0].google_id,
        createdAt: usersQueryResult.rows[0].created_at,
        updatedAt: usersQueryResult.rows[0].updated_at
    };
}

const mapFirstTenantFromQuery = (tenantQueryResult: QueryResult): ITenant | null  => {
    if (tenantQueryResult.rows.length === 0) return null;

    return {
        id: tenantQueryResult.rows[0].id,
        shopifyStoreDomain: tenantQueryResult.rows[0].shopify_store_domain,
        shopifyAccessToken: tenantQueryResult.rows[0].shopify_access_token,
        userId: tenantQueryResult.rows[0].user_id,
        createdAt: tenantQueryResult.rows[0].created_at,
        updatedAt: tenantQueryResult.rows[0].updated_at
    };
}

const mapAllTenantFromQuery = (tenantQueryResult: QueryResult): Array<ITenant> => {
    if (tenantQueryResult.rows.length === 0) return [];

    return tenantQueryResult.rows.map(() => {
        return {
            id: tenantQueryResult.rows[0].id,
            shopifyStoreDomain: tenantQueryResult.rows[0].shopify_store_domain,
            shopifyAccessToken: tenantQueryResult.rows[0].shopify_access_token,
            userId: tenantQueryResult.rows[0].user_id,
            createdAt: tenantQueryResult.rows[0].created_at,
            updatedAt: tenantQueryResult.rows[0].updated_at
        };
    })
}

export const getTenantByUserId = async (userId: string): Promise<ITenant | null> => {
    const result = await queryLogger("SELECT * FROM tenants WHERE user_id = $1", [userId]);
    return mapFirstTenantFromQuery(result);
};

export const getTenantCountForUserByUserId = async (userId: string): Promise<number> => {
    const countResult = await queryLogger("SELECT COUNT(*) FROM tenants WHERE user_id = $1", [userId]);
    return parseInt(countResult.rows[0].count, 10);
};

export const getAllTenantsOfUserByUserId = async (userId: string): Promise<Array<ITenant>> => {
    const result = await queryLogger("SELECT * FROM tenants WHERE user_id = $1", [userId]);
    return mapAllTenantFromQuery(result);
};

export const hasUserExactlyOneTenant = async (userId: string): Promise<boolean> => {
    try {
        const result = await pool.query("SELECT COUNT(*) FROM tenants WHERE user_id = $1", [userId]);
        const count = parseInt(result.rows[0].count, 10);
        return count === 1;
    } catch (error) {
        logger.error(`Error checking tenant count for user ${userId}: ${error.message}`);
        throw new Error("Database error while checking tenant count");
    }
}

export const getUserByGoogleId = async (googleId: string): Promise<IUser | null> => {
    const result = await queryLogger("SELECT * FROM users WHERE google_id = $1", [googleId]);
    if (result.rows.length === 0) {
        logger.warn(`No user found with Google ID: ${googleId}`);
        return null;
    }
    
    return mapFirstUserFromQuery(result);
};

export const getUserById = async (id: string): Promise<IUser | null> => {
    const result = await queryLogger("SELECT * FROM users WHERE id = $1", [id]);
    return mapFirstUserFromQuery(result);
};

export const addUserWithGoogleIdAndEmail = async (googleId: string, email: string): Promise<IUser> => {
    const result = await queryLogger("INSERT INTO users (google_id, email) VALUES ($1, $2) RETURNING *", [googleId, email]);
    if (result.rows.length === 0) {
        logger.error(`Failed to insert user with Google ID: ${googleId}`);
        throw new Error("Failed to insert user with Google ID: " + googleId);
    }
    return mapFirstUserFromQuery(result);
};

export const getTenantByShopifyStoreDomainOrUpdate = async (shopifyStoreName: string, shopifyAccessTokenEncrypted: string, userId: string): Promise<ITenant | null> => {
    const result = await queryLogger(
        `INSERT INTO tenants (shopify_store_domain, shopify_access_token, user_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (shopify_store_domain)
         DO UPDATE SET shopify_access_token = EXCLUDED.shopify_access_token, updated_at = NOW()
         RETURNING id;`,
        [shopifyStoreName, shopifyAccessTokenEncrypted, userId]
    )
    return mapFirstTenantFromQuery(result);
};

export { pool, getClient };