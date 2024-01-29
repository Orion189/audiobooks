import { ThemeProvider } from '@react-navigation/native';
import { ThemeProvider as RNEProvider } from '@rneui/themed';
import useAppFocus from '@src/components/hooks/useAppFocus';
//import useDataSync from '@src/components/hooks/useDataSync';

import useAppLang from '@src/components/hooks/useAppLang';
import useOnline from '@src/components/hooks/useOnline';
import useUpdates from '@src/components/hooks/useUpdates';
import { theme, navigationTheme } from '@src/themes/default';
import { Slot } from 'expo-router';
import { memo } from 'react';

const Layout = memo(() => {
    useOnline();
    useAppFocus();
    useAppLang();
    useUpdates();

    return (
        <RNEProvider theme={theme}>
            <ThemeProvider value={navigationTheme}>
                <Slot />
            </ThemeProvider>
        </RNEProvider>
    );
});

export default Layout;
