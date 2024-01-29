import store from '@src/store';
import * as Updates from 'expo-updates';
import { useEffect, useCallback } from 'react';
import { AppState, Platform } from 'react-native';
import type { AppStateStatus } from 'react-native';

const useAppFocus = () => {
    const handleUpdates = useCallback(async () => {
        try {
            const update = await Updates.checkForUpdateAsync();

            if (update.isAvailable) {
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
            }
        } catch (error) {
            console.error(error);
        }
    }, []);
    const onAppStateChange = (status: AppStateStatus) => {
        if (Platform.OS !== 'web') {
            const isFocused = status === 'active';

            store.set('app', { ...store.app, isFocused });

            if (!isFocused) {
                handleUpdates();
            }
        }
    };

    useEffect(() => {
        const subscription = AppState.addEventListener('change', onAppStateChange);

        return () => subscription.remove();
    }, []);

    return null;
};

export default useAppFocus;
