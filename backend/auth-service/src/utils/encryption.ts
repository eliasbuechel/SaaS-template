import crypto from "crypto";
import {ENCRYPTION_KEY} from "../lib/config";

const ALGORITHM = "aes-256-ctr";
const IV_LENGTH = 16;

export function encryptToken(token: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = Buffer.from(ENCRYPTION_KEY, "utf-8").slice(0, 32);
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(token, "utf8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + ":" + encrypted;
}

export function decryptToken(encryptedToken: string): string {
    const parts = encryptedToken.split(":");
    if (parts.length !== 2) throw new Error("Invalid encrypted token format");
    
    const key = Buffer.from(ENCRYPTION_KEY, "utf-8").slice(0, 32);
    const iv = Buffer.from(parts[0], "hex");
    const encryptedData = parts[1];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
}

export function generateRandomString(length = 64) {
    return crypto.randomBytes(length).toString('hex');
}