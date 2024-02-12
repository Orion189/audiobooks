import { GoogleSignin, statusCodes, NativeModuleError } from '@react-native-google-signin/google-signin';
import { SnackBarVariant, ERROR_STATUS_CODE } from '@src/enums';
import store from '@src/store';
import axios, { AxiosRequestConfig } from 'axios';
import i18n from 'i18next';

//console.error('Error message:', error?.message);
//console.error('Error detailed message:', error?.response?.data?.error?.message);

type DefaultParamsType = {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
};

type APIParams = {
    path: string;
    fields: string;
};

type RequestParamsType = DefaultParamsType & AxiosRequestConfig;
type APIParamsType = DefaultParamsType & APIParams & AxiosRequestConfig;

const EXPO_PUBLIC_API_SERVER_HOSTNAME = process.env.EXPO_PUBLIC_API_SERVER_HOSTNAME;

const invalidateAccessToken = async () => {
    try {
        await GoogleSignin.hasPlayServices();

        const isSignedIn = await GoogleSignin.isSignedIn();

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
const handleAuthError = async (response: any, fn: (params: APIParams) => Promise<any>, params: APIParamsType) => {
    if (response?.status === ERROR_STATUS_CODE.AUTH_ERROR) {
        await GoogleSignin.clearCachedAccessToken(store.authInfo.accessToken);
        await invalidateAccessToken();

        return fn(params);
    }
};

export const apiRequest = async (params: APIParamsType = { path: '', fields: '' }) => {
    const { path, fields, onStart, onEnd } = params;
    const url = `${EXPO_PUBLIC_API_SERVER_HOSTNAME}${path}`;
    const access_token = store.authInfo.accessToken;

    onStart && onStart();

    return axios
        .get(url, {
            params: {
                access_token,
                fields
            }
        })
        .then(({ data }) => data)
        .catch(({ response }) => handleAuthError(response, apiRequest, params))
        .finally(() => onEnd && onEnd());
};
