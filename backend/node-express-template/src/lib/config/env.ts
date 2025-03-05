import BASE_ENV from "./baseEnv.js";

interface CustomEnv {
    DATABASE_URL: string;
}


const CUSTOM_ENV: CustomEnv = {
    DATABASE_URL: "", //getRequiredEnv('DATABASE_URL', TRANSFORMERS.STRING),
};

const ENV = {
    ...BASE_ENV,
    ...CUSTOM_ENV,
};

export default ENV;