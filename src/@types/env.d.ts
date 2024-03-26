declare global {
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined;
            EXPO_PUBLIC_SERVER_HOSTNAME: string;
            EXPO_PUBLIC_SERVER_EMAIL: string;
            EXPO_PUBLIC_WEB_CLIENT_ID: string;
            EXPO_PUBLIC_API_SERVER_HOSTNAME: string;
            EXPO_PUBLIC_NEW_RELIC_IOS_TOKEN: string;
            EXPO_PUBLIC_NEW_RELIC_ANDROID_TOKEN: string;
        }
    }
}

export {};
