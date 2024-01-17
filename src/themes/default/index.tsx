import { DefaultTheme } from '@react-navigation/native';
import { createTheme } from '@rneui/themed';

export const theme = createTheme({
    mode: 'light'
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
