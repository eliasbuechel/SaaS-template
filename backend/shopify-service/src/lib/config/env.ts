import BASE_ENV from "@/lib/config/baseEnv.js";
import TRANSFORMERS from "@/lib/config/transformers.js";
import {getRequiredEnv} from "@/lib/config/envUtils.js";

interface CustomEnv {
    INTERNAL_AUTH_COMMUNICATION_SECRET: string;
    INTERNAL_AUTH_SERVICE_URL: string;
    SHOPIFY_CLIENT_ID: string,
    SHOPIFY_CLIENT_SECRET: string,
    NGROK_TUNNEL_ADDRESS?: string
}


const CUSTOM_ENV: CustomEnv = {
    INTERNAL_AUTH_COMMUNICATION_SECRET: getRequiredEnv("INTERNAL_AUTH_COMMUNICATION_SECRET", TRANSFORMERS.STRING),
    INTERNAL_AUTH_SERVICE_URL: getRequiredEnv("INTERNAL_AUTH_SERVICE_URL", TRANSFORMERS.STRING),
    SHOPIFY_CLIENT_ID: getRequiredEnv('SHOPIFY_CLIENT_ID', TRANSFORMERS.STRING),
    SHOPIFY_CLIENT_SECRET: getRequiredEnv('SHOPIFY_CLIENT_SECRET', TRANSFORMERS.STRING),
    NGROK_TUNNEL_ADDRESS: "" //getDevOnlyRequiredEnv('NGROK_TUNNEL_ADDRESS', TRANSFORMERS.STRING),
};

const ENV = {
    ...BASE_ENV,
    ...CUSTOM_ENV,
};

export default ENV;