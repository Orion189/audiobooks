import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { ThemeProvider } from '@rneui/themed';
import useAppFocus from '@src/components/hooks/useAppFocus';
import useAppLang from '@src/components/hooks/useAppLang';
import useAuth from '@src/components/hooks/useAuth';
import useOnline from '@src/components/hooks/useOnline';
import useUpdates from '@src/components/hooks/useUpdates';
import { theme } from '@src/themes/default';
import { Slot } from 'expo-router';
import { memo } from 'react';

const Layout = memo(() => {
    useOnline();
    useAppFocus();
    useAppLang();
    useUpdates();
    useAuth();

    return (
        <ThemeProvider theme={theme}>
            <ActionSheetProvider>
                <Slot />
            </ActionSheetProvider>
        </ThemeProvider>
    );
});

export default Layout;
