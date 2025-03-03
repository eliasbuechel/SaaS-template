import {pool} from "./connection";
import logger from "../../utils/logger";

export const queryLogger = async (query: string, params: any[]) => {
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