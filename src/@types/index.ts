import { SnackBarVariant, THEME, LOCALE } from '@src/enums';

export type BookType = {
    id: string;
    title: string;
};

export type SettingsType = {
    isDarkMode: boolean;
};

export type UserType = {
    id: string | null;
    email: string;
    isLoggedIn: boolean;
    accessToken: string | null;
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

export type StoreValuesType = BookType | BookType[] | SettingsType | UserType | Partial<AppType>;

export type StoreKeysType = 'books' | 'settings' | 'user';

export type SnackBarVariantType =
    | SnackBarVariant.DEFAULT
    | SnackBarVariant.ERROR
    | SnackBarVariant.INFO
    | SnackBarVariant.SUCCESS
    | SnackBarVariant.WARNING;
