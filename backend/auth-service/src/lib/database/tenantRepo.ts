import {QueryResult} from "pg";
import {ITenant} from "../../interfaces/ITenant";
import {queryLogger} from "./query";
import logger from "../../utils/logger";

const mapTenant = (tenant: Record<string, any>): ITenant => ({
    id: tenant.id,
    shopifyStoreDomain: tenant.shopify_store_domain,
    shopifyAccessToken: tenant.shopify_access_token,
    userId: tenant.user_id,
    createdAt: tenant.created_at,
    updatedAt: tenant.updated_at
});

export const getTenant = async (userId: string, tenantId: string): Promise<ITenant> => {
    const query: string = "SELECT * FROM tenants WHERE user_id = $1 AND id = $2"

    try {
        const result: QueryResult<ITenant> = await queryLogger(query, [userId, tenantId]);
        return mapTenant(result.rows[0]);
    } catch (error) {
        console.error(`Error getting tenant for Tenant: ${tenantId}, User: ${userId}`, error);
        throw new Error("Database error while getting tenant");
    }
};

export const getOnlyTenant = async (userId: string): Promise<ITenant> => {
    const query: string = "SELECT * FROM tenants WHERE user_id = $1";

    try {
        const result: QueryResult<ITenant> = await queryLogger(query, [userId]);
        if (result.rows.length === 0) throw new Error("No tenant found");
        if (result.rows.length > 1) logger.warn("More than one tenant found")
        return mapTenant(result.rows[0]);
    } catch (error) {
        console.error(`Error getting only tenant for User: ${userId}`, error);
        throw new Error("Database error while getting only tenant");
    }
}

export const getLastUpdatedTenant = async (userId: string): Promise<ITenant | null> => {
    const query: string = "SELECT * FROM tenants WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1";

    try {
        const result: QueryResult<ITenant> = await queryLogger(query, [userId]);
        return result.rows.length > 0 ? mapTenant(result.rows[0]) : null;
    } catch (error) {
        console.error(`Error getting last updated tenant for User: ${userId}`, error);
        throw new Error("Database error while getting last updated tenant");
    }
};

export const getAllTenants = async (userId: string): Promise<Array<ITenant>> => {
    const query: string = "SELECT * FROM tenants WHERE user_id = $1";

    try {
        const result: QueryResult<ITenant> = await queryLogger(query, [userId]);
        return result.rows.map(mapTenant);
    } catch (error) {
        logger.error(`Error getting all tenants for User: ${userId}`, error);
        throw new Error("Database error while fetching all tenants");
    }
};

export const createOrUpdateTenant = async (userId: string, shopifyStoreName: string, shopifyAccessTokenEncrypted: string): Promise<ITenant | null> => {
    const query: string =
        `INSERT INTO tenants (shopify_store_domain, shopify_access_token, user_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (shopify_store_domain)
         DO UPDATE SET shopify_access_token = EXCLUDED.shopify_access_token, updated_at = NOW()
         RETURNING *`

    try {
        const result: QueryResult<ITenant> = await queryLogger(query, [shopifyStoreName, shopifyAccessTokenEncrypted, userId]);
        if (result.rows.length === 0) throw new Error("No tenant returned");
        logger.info(`Tenant created/updated for Shopify store: ${shopifyStoreName}, User: ${userId}`);
        return mapTenant(result.rows[0]);
    } catch (error) {
        logger.error(`Error creating/updating tenant for Shopify store: ${shopifyStoreName}, User: ${userId}`, error);
        throw new Error("Database error while creating/updating tenant");
    }
};

export const existsTenantByTenantId = async (userId: string, tenantId: string): Promise<boolean> => {
    const query: string = "SELECT COUNT(*)::int AS count FROM tenants WHERE user_id = $1 AND id = $2"
    
    try {
        const result = await queryLogger(query, [userId, tenantId]);
        const count = result.rows.length > 0 ? parseInt(result.rows[0].count, 10) : 0;
        return count > 0;
    } catch (error) {
        console.error(`Error checking existence for Tenant: ${tenantId}, User: ${userId}`, error);
        throw new Error("Database error while checking existence of tenant");
    }
};

export const getTenantCount = async (userId: string): Promise<number> => {
    const query: string = "SELECT COUNT(*) FROM tenants WHERE user_id = $1";
    
    try {
        const result = await queryLogger(query, [userId]);
        return parseInt(result.rows[0].count, 10) ?? 0;
    } catch (error) {
        console.error(`Error getting tenant count for User: ${userId}`, error);
        throw new Error("Database error while getting tenant count");
    }
};