import { GoogleSignin, statusCodes, NativeModuleError } from '@react-native-google-signin/google-signin';
import { SnackBarVariant, ERROR_STATUS_CODE } from '@src/enums';
import store from '@src/store';
import NewRelic from 'newrelic-react-native-agent';
import axios, { AxiosRequestConfig } from 'axios';
import i18n from 'i18next';

type DefaultParamsType = {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
};

type APIParams = {
    path: string;
    pageSize?: number;
    q?: string;
    fields?: string;
    orderBy?: string;
    alt?: string;
};

type APIParamsType = DefaultParamsType & APIParams & AxiosRequestConfig;

const EXPO_PUBLIC_API_SERVER_HOSTNAME = process.env.EXPO_PUBLIC_API_SERVER_HOSTNAME;

const invalidateAccessToken = async () => {
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
                console.log('sign in error');
        }

        store.set('app', {
            ...store.app,
            snackbar: {
                type: SnackBarVariant.ERROR,
                message: i18n.t('src.components.main.Account.signIn.logInError')
            }
        });
        store.reset('userInfo');
        store.reset('authInfo');
    }
};
const handleError = async (response: any) => {
    if (response?.status === ERROR_STATUS_CODE.AUTH_ERROR) {
        await GoogleSignin.clearCachedAccessToken(store.authInfo.accessToken);
        await invalidateAccessToken();
    }

    NewRelic.recordError(new Error('remote.service - handleError', response?.data?.error as Error));
};

export const apiRequest = async (params: APIParamsType) => {
    const { path = '', pageSize = 100, orderBy = '', q = '', fields = '', alt = '', onStart, onEnd } = params;
    const url = `${EXPO_PUBLIC_API_SERVER_HOSTNAME}${path}`;
    const access_token = store.authInfo.accessToken;

    onStart?.();

    return axios
        .get(url, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${access_token}`
            },
            params: {
                access_token,
                pageSize,
                q,
                alt,
                orderBy,
                fields
            }
        })
        .then(({ data }) => data)
        .catch(({ response }) => handleError(response))
        .finally(() => onEnd?.());
};
