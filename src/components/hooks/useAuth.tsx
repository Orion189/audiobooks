import { GoogleSignin, statusCodes, NativeModuleError } from '@react-native-google-signin/google-signin';
import { SnackBarVariant } from '@src/enums';
import store from '@src/store';
import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const useAuth = () => {
    const { t } = useTranslation();
    const signInCheck = useCallback(async () => {
        try {
            await GoogleSignin.hasPlayServices();
            await GoogleSignin.signInSilently();

            const isSignedIn = await GoogleSignin.isSignedIn();

            if (isSignedIn) {
                const userInfo = await GoogleSignin.getCurrentUser();

                if (userInfo) {
                    store.set('userInfo', { ...store.userInfo, ...userInfo });
                }

                const authInfo = await GoogleSignin.getTokens();

                if (authInfo) {
                    store.set('authInfo', { ...store.authInfo, ...authInfo });
                }
            } else {
                store.reset('userInfo');
                store.reset('authInfo');
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
                    console.log('sign in error:', error);
            }

            store.set('app', {
                ...store.app,
                snackbar: {
                    type: SnackBarVariant.ERROR,
                    message: t('src.components.main.Account.signIn.error')
                }
            });
            store.reset('userInfo');
            store.reset('authInfo');
        }
    }, []);

    useEffect(() => {
        signInCheck();
    }, []);

    return null;
};

export default useAuth;
