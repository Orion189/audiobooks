import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookType, SettingsType, UserInfoType, AppType, StoreValuesType } from '@src/@types';
import { LOCALE, THEME } from '@src/enums';
import { makeObservable, observable, action } from 'mobx';
import { makePersistable, stopPersisting } from 'mobx-persist-store';

export const defaultState: {
    books: BookType[];
    book: BookType;
    settings: SettingsType;
    userInfo: UserInfoType;
    app: AppType;
} = {
    books: [],
    book: {
        id: '',
        title: ''
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
        set(prop: keyof typeof defaultState, value: StoreValuesType) {
            Object.assign(this, {
                [prop]: value
            });
        },
        reset() {
            const { books, book, userInfo, app } = defaultState;

            Object.assign(this, {
                books,
                book,
                userInfo,
                app
            });
        },
        getListById(id: string | undefined): BookType | undefined {
            return this.books?.find((book) => book.id === id);
        }
    },
    {
        books: observable,
        book: observable,
        settings: observable,
        userInfo: observable,
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
        properties: ['books', 'book', 'settings', 'userInfo', 'app'],
        debugMode: process.env.EXPO_PUBLIC_MOBX_DEBUG_MODE === 'true'
    } /*, { delay: 200 }*/
);

export default store;
