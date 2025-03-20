import log from "@/utils/logger"

function envIsMissing(key: string): undefined {
    log.error(`Error: ${key} environment variable must be defined!`);
    return undefined
}

export const dev: boolean = process.env.NODE_ENV !== 'production';
// export const nodeEnv: string = getRequiredEnv('NODE_ENV');
export const NEXT_PUBLIC_AUTH_SERVICE_URL: string = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL as string ?? envIsMissing('NEXT_PUBLIC_AUTH_SERVICE_URL');
export const NEXT_PUBLIC_SHOPIFY_SERVICE_URL: string = process.env.NEXT_PUBLIC_SHOPIFY_SERVICE_URL as string ?? envIsMissing('NEXT_PUBLIC_SHOPIFY_SERVICE_URL');
export const NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL: string = process.env.NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL as string ?? envIsMissing('NEXT_PUBLIC_CUSTOMER_DASHBOARD_URL');