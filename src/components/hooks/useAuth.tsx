import { GoogleSignin, statusCodes, NativeModuleError } from '@react-native-google-signin/google-signin';
import { SnackBarVariant } from '@src/enums';
import store from '@src/store';
import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const useAuth = () => {
    const { t } = useTranslation();
    const signInCheck = useCallback(async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();

        if (isSignedIn) {
            const userInfo = await GoogleSignin.getCurrentUser();

            if (userInfo) {
                store.set('userInfo', { ...store.userInfo, ...userInfo });
            }
        } else {
            try {
                const userInfo = await GoogleSignin.signInSilently();

                if (userInfo) {
                    store.set('userInfo', { ...store.userInfo, ...userInfo });
                }
            } catch (error) {
                switch ((error as NativeModuleError).code) {
                    case statusCodes.SIGN_IN_REQUIRED:
                        console.log('SIGN_IN_REQUIRED');
                        break;
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
            }
        }
    }, []);

    useEffect(() => {
        signInCheck();
    }, []);

    return null;
};

export default useAuth;
