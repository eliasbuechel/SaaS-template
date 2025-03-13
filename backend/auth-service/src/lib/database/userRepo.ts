import {IUser} from "../../interfaces/IUser";
import logger from "../../utils/logger";
import {queryLogger} from "./query";
import {QueryResult} from "pg";

interface IDbUser {
    id: string;
    email: string;
    google_id: string;
    created_at: Date;
    updated_at: Date;
}

const mapUser = (user: IDbUser): IUser => {
    return {
        id: user.id,
        email: user.email,
        googleId: user.google_id,
        createdAt: user.created_at,
        updatedAt: user.updated_at
    };
};

export const getUser = async (id: string): Promise<IUser | null> => {
    const query: string = "SELECT * FROM users WHERE id = $1";

    try {
        const result: QueryResult<IDbUser> = await queryLogger(query, [id]);
        if (result.rows.length === 0) return null;
        return mapUser(result.rows[0]);
    } catch (error) {
        logger.error(`Error getting user ${id}`, error);
        throw new Error("Database error while getting user");
    }
};

export const getUserByGoogleId = async (googleId: string): Promise<IUser | null> => {
    const query: string = "SELECT * FROM users WHERE google_id = $1";
    
    try {
        const result: QueryResult<IDbUser> = await queryLogger(query, [googleId]);
        if (result.rows.length === 0) return null;
        return mapUser(result.rows[0]);
    } catch (error) {
        logger.error(`Error getting user by google id: ${googleId}: ${error.message}`);
        throw new Error("Database error while getting user");
    }
};

export const createUser = async (googleId: string, email: string): Promise<IUser> => {
    const query: string = "INSERT INTO users (google_id, email) VALUES ($1, $2) RETURNING *";
    
    try {
        const result: QueryResult<IDbUser> = await queryLogger(query, [googleId, email]);
        if (result.rows.length === 0) throw new Error("No user returned after creation");
        return mapUser(result.rows[0]);
    } catch (error) {
        logger.error(`Error creating user with googleId: ${googleId}, email: ${email}`, error);
        throw new Error("Database error while getting user");
    }
};