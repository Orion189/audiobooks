import { useThemeMode } from '@rneui/themed';
import store from '@src/store';
import { reaction } from 'mobx';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

const useAppTheme = () => {
    const { setMode } = useThemeMode();
    const deviceTheme = useColorScheme();

    useEffect(() => {
        reaction(
            () => store.app.theme,
            (theme) => setMode(theme || deviceTheme)
        );
    }, []);

    return null;
};

export default useAppTheme;
