import { SnackBarVariant, THEME, LOCALE } from '@src/enums';

export type BookType = {
    id: string;
    title: string;
};

export type SettingsType = {
    isDarkMode: boolean;
};

export type UserType = {
    id: string;
    name: string | null;
    email: string;
    photo: string | null;
    familyName: string | null;
    givenName: string | null;
};

export type UserInfoType = {
    scopes?: string[];
    idToken: string | null;
    serverAuthCode: string | null;
    user: UserType;
};

export type SnackBarType = {
    type: SnackBarVariantType;
    message: string;
    duration?: number;
};

export type AppType = {
    isOnline: boolean;
    isFocused: boolean;
    isProgressBarVisible: boolean;
    snackbar: SnackBarType | null;
    language: LOCALE;
    theme: THEME;
};

export type StoreValuesType = BookType | BookType[] | SettingsType | UserInfoType | Partial<AppType>;

export type StoreKeysType = 'books' | 'settings' | 'userInfo';

export type SnackBarVariantType =
    | SnackBarVariant.DEFAULT
    | SnackBarVariant.ERROR
    | SnackBarVariant.INFO
    | SnackBarVariant.SUCCESS
    | SnackBarVariant.WARNING;
