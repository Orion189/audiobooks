import { SnackBarVariant, THEME, LOCALE, LIB_TYPE, LIB_ORDER, REMOTE_LIB_ITEM_TYPE } from '@src/enums';

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

export type AuthInfoType = {
    idToken: string;
    accessToken: string;
};

export type SnackBarType = {
    type: SnackBarVariantType;
    message: string;
    duration?: number;
};

export type ProgressBarType = {
    isProgressBarVisible: boolean;
    value: number | undefined;
};

export type AppType = {
    isOnline: boolean;
    isFocused: boolean;
    progressbar: ProgressBarType | null;
    isLoadingVisible: boolean;
    snackbar: SnackBarType | null;
    language: LOCALE;
    theme: THEME;
};

export type LibType = {
    curLib: LIB_TYPE;
    order: LIB_ORDER;
    isChangeLibPopupVisible: boolean;
};

export type RemoteLibType = {
    curItem: RemoteLibItemType | undefined;
    subItems?: RemoteLibItemType[];
};

export type RemoteLibItemType = {
    id: string;
    name: string;
    mimeType: REMOTE_LIB_ITEM_TYPE | undefined;
    parents: string[] | undefined;
    size: string | undefined;
};

export type StoreValuesType = LibType | RemoteLibType | SettingsType | UserInfoType | AuthInfoType | Partial<AppType>;

export type StoreKeysType = 'lib' | 'settings' | 'userInfo' | 'authInfo' | 'app' | LIB_TYPE.REMOTE | LIB_TYPE.LOCAL;

export type SnackBarVariantType =
    | SnackBarVariant.DEFAULT
    | SnackBarVariant.ERROR
    | SnackBarVariant.INFO
    | SnackBarVariant.SUCCESS
    | SnackBarVariant.WARNING;
