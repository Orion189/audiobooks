import { useFonts } from 'expo-font';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useCallback, memo } from 'react';

if (!process.env.EXPO_PUBLIC_SERVER_HOSTNAME) {
    console.error('Environment variable SERVER_HOSTNAME is not defined');
}

if (!process.env.EXPO_PUBLIC_SERVER_EMAIL) {
    console.error('Environment variable SERVER_EMAIL is not defined');
}

if (!process.env.EXPO_PUBLIC_WEB_CLIENT_ID) {
    console.error('Environment variable EXPO_PUBLIC_WEB_CLIENT_ID is not defined');
}

if (!process.env.EXPO_PUBLIC_API_SERVER_HOSTNAME) {
    console.error('Environment variable EXPO_PUBLIC_API_SERVER_HOSTNAME is not defined');
}

SplashScreen.preventAutoHideAsync();

const Index = memo(() => {
    const [fontsLoaded, fontError] = useFonts({
        'SuisseIntl-Regular': require('@assets/fonts/SuisseIntl-Regular.otf'),
        'SuisseIntl-Bold': require('@assets/fonts/SuisseIntl-Bold.otf')
    });
    const onFontLoaded = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    useEffect(() => {
        onFontLoaded();
    }, []);

    return !fontsLoaded && !fontError ? null : <Redirect href="/home" />;
});

export default Index;
