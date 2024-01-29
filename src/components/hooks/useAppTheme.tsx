import { useThemeMode } from '@rneui/themed';
import store from '@src/store';
import { autorun } from 'mobx';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

const useAppTheme = () => {
    const { setMode } = useThemeMode();
    const deviceTheme = useColorScheme();

    useEffect(() => {
        autorun(() => setMode(store.app.theme || deviceTheme));
    }, []);

    return null;
};

export default useAppTheme;
