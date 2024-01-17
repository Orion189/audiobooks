import { ThemeProvider } from '@react-navigation/native';
import { ThemeProvider as RNEProvider } from '@rneui/themed';
import { theme, navigationTheme } from '@src/themes/default';
//import useAppFocus from '@src/components/hooks/useAppFocus';
//import useDataSync from '@src/components/hooks/useDataSync';
//import useUpdates from '@src/components/hooks/useUpdates';
//import useOnline from '@src/components/hooks/useOnline';
import { Slot } from 'expo-router';
import { memo } from 'react';

const Layout = memo(() => {
    //useOnline();
    //useAppFocus();
    //useDataSync();
    //useUpdates();

    return (
        <RNEProvider theme={theme}>
            <ThemeProvider value={navigationTheme}>
                <Slot />
            </ThemeProvider>
        </RNEProvider>
    );
});

export default Layout;
