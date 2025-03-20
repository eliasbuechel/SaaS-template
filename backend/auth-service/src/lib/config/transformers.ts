import {NodeEnv} from "@/lib/config/baseEnv.js";

const TRANSFORMERS = {
    STRING: (value: string) => value,
    BOOLEAN: (value: string) => value.toLowerCase() === "true",
    NUMBER: (value: string): number => {
        const num: number = Number(value) || NaN;
        if (isNaN(num)) {
            throw new Error(`Invalid number value: ${value}`);
        }
        return num;
    },
    NODE_ENV: (value: string): NodeEnv => {
        if (!Object.values(NodeEnv).includes(value as NodeEnv)) {
            throw new Error(`Invalid NODE_ENV value: ${value}. Expected one of: ${Object.values(NodeEnv).join(", ")}`);
        }
        return value as NodeEnv;
    },
};

export default TRANSFORMERS;