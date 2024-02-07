import { DefaultTheme } from '@react-navigation/native';
import { createTheme, lightColors, darkColors } from '@rneui/themed';
import { Platform } from 'react-native';

export const theme = createTheme({
    mode: 'light',
    lightColors: {
        ...Platform.select({
            default: lightColors.platform.default,
            ios: lightColors.platform.ios,
            android: lightColors.platform.android
        })
    },
    darkColors: {
        ...Platform.select({
            default: darkColors.platform.default,
            ios: darkColors.platform.ios,
            android: darkColors.platform.android
        })
    }
});

export const navigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#193BEA',
        secondary: '#4cd964',
        error: '#ff3b30'
    }
};
