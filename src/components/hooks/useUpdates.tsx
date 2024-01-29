import * as Updates from 'expo-updates';
import { useCallback } from 'react';

const useUpdates = () => {
    const eventListener = useCallback(async (event: Updates.UpdateEvent) => {
        switch (event.type) {
            case Updates.UpdateEventType.ERROR: {
                console.error(event.message);

                break;
            }
            case Updates.UpdateEventType.UPDATE_AVAILABLE: {
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();

                break;
            }
        }
    }, []);

    Updates.useUpdateEvents(eventListener);

    return null;
};

export default useUpdates;
