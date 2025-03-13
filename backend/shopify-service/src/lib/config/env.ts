import BASE_ENV from "./baseEnv.js";
import {getRequiredEnv} from "./envUtils.js";
import TRANSFORMERS from "./transformers.js";

interface CustomEnv {
    DATABASE_URL: string;
    INTERNAL_AUTH_COMMUNICATION_SECRET: string;
}


const CUSTOM_ENV: CustomEnv = {
    DATABASE_URL: "", //getRequiredEnv('DATABASE_URL', TRANSFORMERS.STRING),
    INTERNAL_AUTH_COMMUNICATION_SECRET: getRequiredEnv("INTERNAL_AUTH_COMMUNICATION_SECRET", TRANSFORMERS.STRING)
};

const ENV = {
    ...BASE_ENV,
    ...CUSTOM_ENV,
};

export default ENV;