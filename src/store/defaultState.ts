import { LOCALE, THEME, LIB_TYPE, LIB_ORDER } from '@src/enums';
import {
    SettingsType,
    LibType,
    UserInfoType,
    AuthInfoType,
    AppType,
    LibViewType,
    LibItemType,
    PlayerType
} from '@src/@types';

export const defaultState: {
    player: PlayerType;
    lib: LibViewType;
    [LIB_TYPE.REMOTE]: LibType;
    [LIB_TYPE.LOCAL]: LibType;
    history: LibItemType[];
    settings: SettingsType;
    userInfo: UserInfoType;
    authInfo: AuthInfoType;
    app: AppType;
} = {
    player: {
        isVisible: false,
        isCollapsed: true,
        isPlaying: false,
        volume: 0.5,
        rate: 1,
        duration: 0,
        position: 0,
        sound: null,
        itemName: '',
        itemId: '',
        itemURI: ''
    },
    lib: {
        curLib: LIB_TYPE.NONE,
        order: LIB_ORDER.DEFAULT,
        isChangeLibPopupVisible: false
    },
    [LIB_TYPE.REMOTE]: {
        curItem: {
            id: '',
            name: '',
            isRemote: true,
            isDirectory: false,
            uri: '',
            parents: []
        },
        subItems: []
    },
    [LIB_TYPE.LOCAL]: {
        curItem: {
            name: '',
            isRemote: false,
            isDirectory: false,
            uri: ''
        },
        subItems: [],
        downloadedItemNames: []
    },
    history: [],
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
