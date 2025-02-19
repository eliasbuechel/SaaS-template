import pg from 'pg'
const { Pool, Client } = pg
const connectionString = process.env.DATABASE_URL

const pool = new Pool({
    connectionString,
})

const getClient = async () => {
    const client = new Client({ connectionString });
    await client.connect();
    return client;
};

export const connect = async () => {
    try {
        const res = await pool.query("SELECT NOW()");
        console.log("Database connected at:", res.rows[0].now);
    } catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
};

export { pool, getClient };