function envIsMissing(key: string): undefined {
    console.error(`Error: ${key} environment variable must be defined!`);
    return undefined
}

export const dev: boolean = process.env.NODE_ENV !== 'production';
// export const nodeEnv: string = getRequiredEnv('NODE_ENV');
export const NEXT_PUBLIC_AUTH_SERVICE_URL: string = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL as string ?? envIsMissing('NEXT_PUBLIC_AUTH_SERVICE_URL');