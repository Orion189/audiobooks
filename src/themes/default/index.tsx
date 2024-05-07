import { createTheme, lightColors, darkColors } from '@rneui/themed';
import { Platform } from 'react-native';

export const theme = createTheme({
    lightColors: {
        ...Platform.select({
            default: lightColors.platform.default,
            ios: lightColors.platform.ios,
            android: lightColors.platform.android
        }),
        white: '#ffffff',
        primary: '#392228',
        secondary: '#E4D7D1',
        background: '#F6EEE4',
        divider: '#B99FA2',
        sectionTitleColor: '#392228',
        textColor: '#392228',
        btnPrimary: '#D34C02',
        headerBgColor: '#392228',
        tabBarBgColor: '#F6EEE4',
        tabBarDefaultColor: '#B9A0A7',
        tabBarActiveColor: '#392228'
    },
    darkColors: {
        ...Platform.select({
            default: darkColors.platform.default,
            ios: darkColors.platform.ios,
            android: darkColors.platform.android
        }),
        white: '#ffffff',
        primary: '#0E090A',
        secondary: '#251B1D',
        background: '#190F12',
        divider: '#392228',
        sectionTitleColor: '#DDD1D4',
        textColor: '#CFBDC2',
        btnPrimary: '#D34C02',
        headerBgColor: '#0E090A',
        tabBarBgColor: '#0E090A',
        tabBarDefaultColor: '#9C7983',
        tabBarActiveColor: '#CFBDC2'
    },
    mode: 'light'
});
