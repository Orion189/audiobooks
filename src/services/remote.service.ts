import { GoogleSignin, statusCodes, NativeModuleError } from '@react-native-google-signin/google-signin';
import { SnackBarVariant, ERROR_STATUS_CODE } from '@src/enums';
import store from '@src/store';
import axios, { AxiosRequestConfig } from 'axios';
import i18n from 'i18next';

type DefaultParamsType = {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
};

type AboutParams = {
    storageQuota: string;
};

type RequestParamsType = DefaultParamsType & AxiosRequestConfig;
type AboutParamsType = DefaultParamsType & AboutParams & AxiosRequestConfig;

const EXPO_PUBLIC_API_SERVER_HOSTNAME = process.env.EXPO_PUBLIC_API_SERVER_HOSTNAME;

const invalidateAccessToken = async () => {
    try {
        await GoogleSignin.hasPlayServices();

        const isSignedIn = await GoogleSignin.isSignedIn();
console.log('isSignedIn:', isSignedIn);
        if (isSignedIn) {
            const userInfo = await GoogleSignin.getCurrentUser();

            if (userInfo) {
                store.set('userInfo', { ...store.userInfo, ...userInfo });
            } else {
                const userInfo = await GoogleSignin.signInSilently();

                if (userInfo) {
                    store.set('userInfo', { ...store.userInfo, ...userInfo });
                }

                const authInfo = await GoogleSignin.getTokens();

                if (authInfo) {
                    store.set('authInfo', { ...store.authInfo, ...authInfo });
                }
            }
        } else {
            await GoogleSignin.clearCachedAccessToken(store.authInfo.accessToken);

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
                console.log('sign in error');
        }

        await GoogleSignin.clearCachedAccessToken(store.authInfo.accessToken);

        store.set('app', {
            ...store.app,
            snackbar: {
                type: SnackBarVariant.ERROR,
                message: i18n.t('src.components.main.Account.signIn.error')
            }
        });
        store.reset('userInfo');
        store.reset('authInfo');
    }
};
//console.error('Error message:', error?.message);
//console.error('Error detailed message:', error?.response?.data?.error?.message);
export const about = async (params: RequestParamsType = {}) => {
    const { onStart, onEnd } = params;
    const url = `${EXPO_PUBLIC_API_SERVER_HOSTNAME}/about`;
    const access_token = store.authInfo.accessToken;

    onStart && onStart();

    return axios
        .get(url, {
            params: {
                access_token,
                fields: 'storageQuota,maxUploadSize'
            }
        })
        .then(({ data }) => data)
        .catch(async ({ response }) => {
            if (response?.status === ERROR_STATUS_CODE.AUTH_ERROR) {
                await invalidateAccessToken();

                about(params);
            }
        })
        .finally(() => onEnd && onEnd());
};
