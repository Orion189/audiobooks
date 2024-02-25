import { LocalLibItemType } from '@src/@types';
import { LIB_TYPE } from '@src/enums';
import store from '@src/store';
import { documentDirectory, getInfoAsync, readDirectoryAsync } from 'expo-file-system';
import { useCallback } from 'react';

type ConfigType = {
    onStart?: () => void;
    onEnd?: () => void;
};

const useRemoteLib = () => {
    const getItem = useCallback(
        async (id: string, parent: string, config: ConfigType = {}) => {
            if (store.authInfo.accessToken) {
                // TODO: check local permissions
                const { onStart, onEnd } = config;

                onStart && onStart();

                const { exists, isDirectory, uri } = await getInfoAsync(documentDirectory + id);

                if (exists) {
                    store.set(LIB_TYPE.LOCAL, {
                        ...store[LIB_TYPE.LOCAL],
                        curItem: {
                            id,
                            parent,
                            isDirectory,
                            uri
                        },
                        subItems: []
                    });
                }

                onEnd && onEnd();
            }
        },
        [store.authInfo.accessToken]
    );
    const getSubItems = useCallback(
        async (config: ConfigType = {}) => {
            const { isDirectory, uri } = store[LIB_TYPE.LOCAL].curItem ?? {};

            if (isDirectory && uri) {
                const { onStart, onEnd } = config;

                onStart && onStart();

                const itemNames = await readDirectoryAsync(uri);

                if (itemNames.length) {
                    const subItemsPromises = itemNames.map(
                        (itemName) =>
                            new Promise<LocalLibItemType>((resolve, reject) =>
                                getInfoAsync(uri + itemName)
                                    .then((subItemInfo) =>
                                        resolve({
                                            id: itemName,
                                            parent: uri,
                                            isDirectory: subItemInfo.isDirectory,
                                            uri: subItemInfo.uri
                                        })
                                    )
                                    .catch(reject)
                            )
                    );
                    const subItems = await Promise.all(subItemsPromises);

                    store.set(LIB_TYPE.LOCAL, {
                        ...store[LIB_TYPE.LOCAL],
                        subItems
                    });
                }

                onEnd && onEnd();
            }
        },
        [store[LIB_TYPE.REMOTE].curItem]
    );

    return {
        getItem,
        getSubItems
    };
};

export default useRemoteLib;
