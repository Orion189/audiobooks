module.exports = {
    expo: {
        name: 'My ABooks',
        slug: 'audiobooks',
        version: '1.0.0',
        autoIncrement: 'version',
        icon: './assets/icon.png',
        userInterfaceStyle: 'light',
        splash: {
            image: './assets/splash.png',
            resizeMode: 'contain',
            backgroundColor: '#F6EEE4'
        },
        assetBundlePatterns: ['**/*'],
        scheme: 'audiobooks',
        ios: {
            supportsTablet: true,
            bundleIdentifier: 'com.orion189.audiobooks',
            appStoreUrl: process.env.APP_STORE_LINK,
            config: {
                usesNonExemptEncryption: false
            },
            requireFullScreen: true,
            googleServicesFile: process.env.GOOGLE_SERVICES_FILE_IOS,
            buildNumber: '1.0.0'
        },
        android: {
            icon: './assets/icon.png',
            adaptiveIcon: {
                foregroundImage: './assets/adaptive-icon.png',
                backgroundColor: '#F6EEE4'
            },
            package: 'com.orion189.audiobooks',
            playStoreUrl: process.env.GOOGLE_PLAY_LINK,
            softwareKeyboardLayoutMode: 'pan',
            googleServicesFile: process.env.GOOGLE_SERVICES_FILE_ANDROID,
            versionCode: 6
        },
        web: {
            favicon: './assets/favicon.png'
        },
        plugins: [
            '@react-native-google-signin/google-signin',
            'expo-localization',
            'expo-router',
            'newrelic-react-native-agent',
            [
                'expo-build-properties',
                {
                    android: {
                        minSdkVersion: 34,
                        compileSdkVersion: 34,
                        targetSdkVersion: 34,
                        buildToolsVersion: '34.0.0'
                    },
                    ios: {
                        deploymentTarget: '13.4'
                    }
                }
            ],
            [
                'expo-screen-orientation',
                {
                    initialOrientation: 'DEFAULT'
                }
            ]
        ],
        experiments: {
            tsconfigPaths: true
        },
        extra: {
            router: {
                origin: false
            },
            eas: {
                projectId: '4f833c54-25af-42b3-8a7c-2d707ff537cc'
            }
        },
        owner: 'orion189',
        runtimeVersion: {
            policy: 'appVersion'
        },
        updates: {
            url: 'https://u.expo.dev/4f833c54-25af-42b3-8a7c-2d707ff537cc'
        }
    }
};
