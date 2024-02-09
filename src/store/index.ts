import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookType, SettingsType, UserInfoType, AuthInfoType, AppType, StoreValuesType, LibType } from '@src/@types';
import { LOCALE, THEME, LIB_TYPE, LIB_ORDER } from '@src/enums';
import { makeObservable, observable, action } from 'mobx';
import { makePersistable, stopPersisting } from 'mobx-persist-store';

export const defaultState: {
    books: BookType[];
    book: BookType;
    lib: LibType;
    settings: SettingsType;
    userInfo: UserInfoType;
    authInfo: AuthInfoType;
    app: AppType;
} = {
    books: [],
    book: {
        id: '',
        title: ''
    },
    lib: {
        curLib: LIB_TYPE.NONE,
        order: LIB_ORDER.DEFAULT,
        isChangeLibPopupVisible: false
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
        isProgressBarVisible: false,
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
        books: observable,
        book: observable,
        lib: observable,
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
        properties: ['books', 'book', 'lib','settings', 'userInfo', 'authInfo', 'app'],
        debugMode: process.env.EXPO_PUBLIC_MOBX_DEBUG_MODE === 'true'
    } /*, { delay: 200 }*/
);

export default store;
