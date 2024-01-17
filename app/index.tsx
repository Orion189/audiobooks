import { useFonts } from 'expo-font';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useCallback, memo } from 'react';

SplashScreen.preventAutoHideAsync();

const Index = memo(() => {
    const [fontsLoaded, fontError] = useFonts({
        'SuisseIntl-Regular': require('../assets/fonts/SuisseIntl-Regular.otf'),
        'SuisseIntl-Bold': require('../assets/fonts/SuisseIntl-Bold.otf')
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
