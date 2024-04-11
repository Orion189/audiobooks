import { GoogleSignin, statusCodes, NativeModuleError } from '@react-native-google-signin/google-signin';
import AccountView from '@src/components/main/Account/Account';
import { SnackBarVariant } from '@src/enums';
import store from '@src/store';
import { observer } from 'mobx-react-lite';
import NewRelic from 'newrelic-react-native-agent';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const EXPO_PUBLIC_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;

const Account = observer(() => {
    const { t } = useTranslation();
    const signIn = useCallback(async () => {
        try {
            await GoogleSignin.hasPlayServices();

            const userInfo = await GoogleSignin.signIn();

            if (userInfo) {
                store.set('userInfo', { ...store.userInfo, ...userInfo });

                const authInfo = await GoogleSignin.getTokens();

                if (authInfo) {
                    store.set('authInfo', { ...store.authInfo, ...authInfo });
                }
            }
        } catch (error) {
            switch ((error as NativeModuleError).code) {
                case statusCodes.SIGN_IN_CANCELLED:
                    console.log('SIGN_IN_CANCELLED');
                    break;
                case statusCodes.IN_PROGRESS:
                    console.log('IN_PROGRESS');
                    break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    console.log('PLAY_SERVICES_NOT_AVAILABLE');
                    break;
                default:
                    console.log('sign in error');
            }

            store.set('app', {
                ...store.app,
                snackbar: {
                    type: SnackBarVariant.SUCCESS,
                    message: t('src.components.main.Account.signIn.error')
                }
            });
            store.reset('userInfo');
            store.reset('authInfo');
        }
    }, [store.userInfo]);
    const signOut = useCallback(async () => {
        try {
            await GoogleSignin.signOut();
            await GoogleSignin.clearCachedAccessToken(store.authInfo.accessToken);

            store.reset('userInfo');
            store.reset('authInfo');
        } catch (e) {
            NewRelic.recordError(new Error('[Account] - signOut', e as Error));
        }
    }, []);

    useEffect(() => {
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.file'], // what API you want to access on behalf of the user, default is email and profile
            webClientId: EXPO_PUBLIC_WEB_CLIENT_ID, // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access.
            offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
            hostedDomain: '', // specifies a hosted domain restriction
            forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
            //accountName: '', // [Android] specifies an account name on the device that should be used
            //iosClientId: '', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
            //googleServicePlistPath: './GoogleService-Info.plist', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
            //openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
            profileImageSize: 120 // [iOS] The desired height (and width) of the profile image. Defaults to 120px
        });
    }, []);

    return <AccountView signIn={signIn} signOut={signOut} />;
});

export default Account;
