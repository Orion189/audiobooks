import { SnackBarVariant, THEME, LOCALE, LIB_TYPE, LIB_ORDER } from '@src/enums';
import { Audio } from 'expo-av';

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
    value?: number;
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

export type PlayerType = {
    isVisible: boolean;
    isCollapsed: boolean;
    isPlaying: boolean;
    volume: number;
    duration: number | undefined;
    position: number;
    sound: Audio.Sound | null;
    itemName: string;
    itemId: string;
    itemURI: string;
};

export type LibViewType = {
    curLib: LIB_TYPE;
    order: LIB_ORDER;
    isChangeLibPopupVisible: boolean;
};

export type LibType = {
    curItem?: LibItemType;
    subItems?: LibItemType[];
    downloadedItemNames?: string[];
};

export type LibItemType = {
    name: string;
    uri: string;
    isDirectory: boolean;
    isRemote: boolean;
    id?: string;
    parents?: string[];
};

export type StoreValuesType =
    | PlayerType
    | LibViewType
    | LibType
    | LibItemType[]
    | SettingsType
    | UserInfoType
    | AuthInfoType
    | Partial<AppType>;

export type StoreKeysType =
    | 'player'
    | 'lib'
    | 'settings'
    | 'userInfo'
    | 'authInfo'
    | 'app'
    | 'history'
    | LIB_TYPE.REMOTE
    | LIB_TYPE.LOCAL;

export type SnackBarVariantType =
    | SnackBarVariant.DEFAULT
    | SnackBarVariant.ERROR
    | SnackBarVariant.INFO
    | SnackBarVariant.SUCCESS
    | SnackBarVariant.WARNING;
