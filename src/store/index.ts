import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookType, SettingsType, UserType, AppType, StoreValuesType } from '@src/@types';
import { makeObservable, observable, action } from 'mobx';
import { makePersistable, stopPersisting } from 'mobx-persist-store';

const defaultState: {
    books: BookType[];
    book: BookType;
    settings: SettingsType;
    user: UserType;
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
    user: {
        id: null,
        email: '',
        isLoggedIn: false,
        accessToken: null
    },
    app: {
        isFocused: true,
        isOnline: false,
        isProgressBarVisible: false,
        snackbar: null
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
            const { books, book, user } = defaultState;

            Object.assign(this, {
                books,
                book,
                user
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
        user: observable,
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
        properties: ['books', 'book', 'settings', 'user', 'app'],
        debugMode: process.env.EXPO_PUBLIC_MOBX_DEBUG_MODE === 'true'
    } /*, { delay: 200 }*/
);

export default store;
