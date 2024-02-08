import store from '@src/store';
import axios, { AxiosRequestConfig } from 'axios';
//import i18n from 'i18next';

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

export const about = async (params: RequestParamsType = {}) => {
    const { onStart, onEnd } = params;
    const url = `${EXPO_PUBLIC_API_SERVER_HOSTNAME}/about`;
    const access_token = store.authInfo.accessToken;
    //const lang = i18n.resolvedLanguage;

    onStart && onStart();

    return axios
        .get(url, {
            params: {
                access_token,
                fields: 'storageQuota,maxUploadSize'
            }
        })
        .then(async (response) => {
            /*const { error } = response.data;

            if (error?.code === ResponseErrorCodes.INVALID_ACCESS_TOKEN) {
                await invalidateAccessToken();

                getLists(params);

                return;
            }*/

            console.log('Response:', response);

            return response?.data;
        })
        .catch((error) => {
            console.error(error.toJSON());
        })
        .finally(() => onEnd && onEnd());
};
