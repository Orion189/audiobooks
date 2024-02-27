import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    SettingsType,
    RemoteLibType,
    LocalLibType,
    UserInfoType,
    AuthInfoType,
    AppType,
    StoreValuesType,
    LibType
} from '@src/@types';
import { LOCALE, THEME, LIB_TYPE, LIB_ORDER } from '@src/enums';
import { makeObservable, observable, action } from 'mobx';
import { makePersistable, stopPersisting } from 'mobx-persist-store';

export const defaultState: {
    lib: LibType;
    [LIB_TYPE.REMOTE]: RemoteLibType;
    [LIB_TYPE.LOCAL]: LocalLibType;
    settings: SettingsType;
    userInfo: UserInfoType;
    authInfo: AuthInfoType;
    app: AppType;
} = {
    lib: {
        curLib: LIB_TYPE.NONE,
        order: LIB_ORDER.DEFAULT,
        isChangeLibPopupVisible: false
    },
    [LIB_TYPE.REMOTE]: {
        curItem: {
            id: '',
            name: '',
            mimeType: undefined,
            parents: [],
            size: undefined
        },
        subItems: []
    },
    [LIB_TYPE.LOCAL]: {
        curItem: {
            name: '',
            isDirectory: false,
            uri: ''
        },
        subItems: [],
        downloadedItemNames: []
    },
    settings: {
        isDarkMode: false
    },
    userInfo: {
        idToken: '',
        serverAuthCode: '',
        scopes: [],
        user: {
            email: '',
            id: '',
            givenName: '',
            familyName: '',
            photo: '',
            name: ''
        }
    },
    authInfo: {
        idToken: '',
        accessToken: ''
    },
    app: {
        isFocused: true,
        isOnline: false,
        isLoadingVisible: false,
        progressbar: null,
        snackbar: null,
        language: LOCALE.EN,
        theme: THEME.LIGHT
    }
};

const store = makeObservable(
    {
        ...defaultState,
        set(key: keyof typeof defaultState, value: StoreValuesType) {
            Object.assign(this, {
                [key]: value
            });
        },
        reset(key?: keyof typeof defaultState) {
            if (key) {
                Object.assign(this, {
                    [key]: defaultState[key]
                });
            } else {
                Object.assign(this, defaultState);
            }
        }
    },
    {
        lib: observable,
        [LIB_TYPE.REMOTE]: observable,
        [LIB_TYPE.LOCAL]: observable,
        settings: observable,
        userInfo: observable,
        authInfo: observable,
        app: observable,
        set: action,
        reset: action
    },
    { autoBind: true }
);

stopPersisting(store); // remove for PROD
makePersistable(
    store,
    {
        storage: AsyncStorage,
        name: 'AudiobooksStore',
        properties: ['lib', 'settings', 'userInfo', 'authInfo', 'app', LIB_TYPE.REMOTE, LIB_TYPE.LOCAL],
        debugMode: process.env.EXPO_PUBLIC_MOBX_DEBUG_MODE === 'true'
    } /*, { delay: 200 }*/
);

export default store;
