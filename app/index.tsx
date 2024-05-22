import { useTheme } from '@rneui/themed';
import { useFonts } from 'expo-font';
import { Redirect } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as SplashScreen from 'expo-splash-screen';
import NewRelic from 'newrelic-react-native-agent';
import { useEffect, useCallback, memo } from 'react';
import { Platform, View, StyleSheet } from 'react-native';

import * as appVersion from '../package.json';

if (!process.env.EXPO_PUBLIC_SERVER_HOSTNAME) {
    NewRelic.recordError(new Error('Environment variable SERVER_HOSTNAME is not defined'));
}

if (!process.env.EXPO_PUBLIC_SERVER_EMAIL) {
    NewRelic.recordError(new Error('Environment variable SERVER_EMAIL is not defined'));
}

if (!process.env.EXPO_PUBLIC_WEB_CLIENT_ID) {
    NewRelic.recordError(new Error('Environment variable EXPO_PUBLIC_WEB_CLIENT_ID is not defined'));
}

if (!process.env.EXPO_PUBLIC_API_SERVER_HOSTNAME) {
    NewRelic.recordError(new Error('Environment variable EXPO_PUBLIC_API_SERVER_HOSTNAME is not defined'));
}

if (!process.env.EXPO_PUBLIC_NEW_RELIC_IOS_TOKEN) {
    NewRelic.recordError(new Error('Environment variable EXPO_PUBLIC_NEW_RELIC_IOS_TOKEN is not defined'));
}

if (!process.env.EXPO_PUBLIC_NEW_RELIC_ANDROID_TOKEN) {
    NewRelic.recordError(new Error('Environment variable EXPO_PUBLIC_NEW_RELIC_ANDROID_TOKEN is not defined'));
}

const appToken =
    Platform.OS === 'ios'
        ? process.env.EXPO_PUBLIC_NEW_RELIC_IOS_TOKEN
        : process.env.EXPO_PUBLIC_NEW_RELIC_ANDROID_TOKEN;
const agentConfiguration = {
    //Android Specific
    // Optional:Enable or disable collection of event data.
    analyticsEventEnabled: true,

    // Optional:Enable or disable crash reporting.
    crashReportingEnabled: true,

    // Optional:Enable or disable interaction tracing. Trace instrumentation still occurs, but no traces are harvested. This will disable default and custom interactions.
    interactionTracingEnabled: true,

    // Optional:Enable or disable reporting successful HTTP requests to the MobileRequest event type.
    networkRequestEnabled: true,

    // Optional:Enable or disable reporting network and HTTP request errors to the MobileRequestError event type.
    networkErrorRequestEnabled: true,

    // Optional:Enable or disable capture of HTTP response bodies for HTTP error traces, and MobileRequestError events.
    httpResponseBodyCaptureEnabled: true,

    // Optional:Enable or disable agent logging.
    loggingEnabled: true,

    // Optional:Specifies the log level. Omit this field for the default log level.
    // Options include: ERROR (least verbose), WARNING, INFO, VERBOSE, AUDIT (most verbose).
    logLevel: NewRelic.LogLevel.INFO,

    // iOS Specific
    // Optional:Enable/Disable automatic instrumentation of WebViews
    webViewInstrumentation: true

    // Optional:Set a specific collector address for sending data. Omit this field for default address.
    // collectorAddress: "",

    // Optional:Set a specific crash collector address for sending crashes. Omit this field for default address.
    // crashCollectorAddress: ""
};

NewRelic.startAgent(appToken, agentConfiguration);
NewRelic.setJSAppVersion(appVersion.version);

SplashScreen.preventAutoHideAsync();

const Index = memo(() => {
    const {
        theme: {
            colors: { background }
        }
    } = useTheme();
    const [fontsLoaded, fontError] = useFonts({
        'SuisseIntl-Regular': require('@assets/fonts/SuisseIntl-Regular.otf'),
        'SuisseIntl-Bold': require('@assets/fonts/SuisseIntl-Bold.otf')
    });
    const onFontLoaded = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);
    const lockOrientation = useCallback(async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }, []);

    useEffect(() => {
        onFontLoaded();
        lockOrientation();
    }, []);

    return !fontsLoaded && !fontError ? null : (
        <View style={[styles.container, { backgroundColor: background }]}>
            <Redirect href="/home" />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default Index;
