import crypto from "crypto";
import {ENCRYPTION_KEY} from "../lib/config";

const ALGORITHM = "aes-256-ctr";
const IV_LENGTH = 16;

const getKey = () => Buffer.from(ENCRYPTION_KEY, "utf-8").subarray(0, 32);

export function encryptToken(token: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
    let encrypted = cipher.update(token, "utf8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + ":" + encrypted;
}

export function decryptToken(encryptedToken: string): string {
    const parts = encryptedToken.split(":");
    if (parts.length !== 2) throw new Error("Invalid encrypted token format");
    
    const iv = Buffer.from(parts[0], "hex");
    const encryptedData = parts[1];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
}

export function encryptSessionData(data: object): string {
    const jsonString = JSON.stringify(data);
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
    let encrypted = cipher.update(jsonString, "utf8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + ":" + encrypted;
}

export function decryptSessionData(encryptedData: string): object {
    try {
        const parts = encryptedData.split(":");
        if (parts.length !== 2) throw new Error("Invalid encrypted session format");

        const iv = Buffer.from(parts[0], "hex");
        const encryptedJson = parts[1];

        const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
        let decrypted = decipher.update(encryptedJson, "hex", "utf8");
        decrypted += decipher.final("utf8");

        return JSON.parse(decrypted);
    } catch (error) {
        throw new Error("Decryption failed: Invalid session data");
    }
}

export function generateRandomString(length = 64) {
    return crypto.randomBytes(length).toString('hex');
}