import { createTheme, lightColors, darkColors } from '@rneui/themed';
import { Platform } from 'react-native';

export const theme = createTheme({
    lightColors: {
        ...Platform.select({
            default: lightColors.platform.default,
            ios: lightColors.platform.ios,
            android: lightColors.platform.android
        }),
        primary: '#392228',
        secondary: '#E4D7D1',
        background: '#F6EEE4',
        divider: '#B99FA2',
        subTitle: '#746065',
        btnPrimary: '#D34C02'
    },
    darkColors: {
        ...Platform.select({
            default: darkColors.platform.default,
            ios: darkColors.platform.ios,
            android: darkColors.platform.android
        })
    },
    mode: 'light'
});
