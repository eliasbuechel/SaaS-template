import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_REFRESH_SECRET } from "../lib/config";

export const generateAccessToken = (user: { id: string; email: string }, tenantId?: string): string => {
    const payload = tenantId ? { id: user.id, email: user.email, tenant_id: tenantId } : { id: user.id, email: user.email };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};