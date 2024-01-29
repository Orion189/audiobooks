import { useNetInfo } from '@react-native-community/netinfo';
import store from '@src/store';
import { useEffect } from 'react';

const useOnline = () => {
    const netInfo = useNetInfo();

    useEffect(() => {
        // Add notification
        store.set('app', { ...store.app, isOnline: !!netInfo.isConnected });
    }, [netInfo.isConnected]);

    return null;
};

export default useOnline;
