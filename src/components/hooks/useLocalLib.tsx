import { LibItemType } from '@src/@types';
import { LOCAL_ITEMS_TO_HIDE } from '@src/constants';
import { LIB_TYPE } from '@src/enums';
import store from '@src/store';
import { getInfoAsync, readDirectoryAsync, deleteAsync, documentDirectory } from 'expo-file-system';
import { useCallback } from 'react';

type ConfigType = {
    onStart?: () => void;
    onEnd?: () => void;
};

const useLocalLib = () => {
    const getItem = useCallback(
        async (itemURI: string, config: ConfigType = {}) => {
            const { onStart, onEnd } = config;

            onStart?.();

            const { exists, isDirectory, uri } = await getInfoAsync(itemURI);

            if (exists) {
                store.set(LIB_TYPE.LOCAL, {
                    ...store[LIB_TYPE.LOCAL],
                    curItem: {
                        name: '',
                        isDirectory,
                        uri,
                        isRemote: false
                    },
                    subItems: []
                });
            }

            onEnd?.();
        },
        [getInfoAsync]
    );
    const getSubItems = useCallback(
        async (config: ConfigType = {}) => {
            const { isDirectory, uri } = store[LIB_TYPE.LOCAL].curItem ?? {};

            if (isDirectory && uri) {
                const { onStart, onEnd } = config;

                onStart?.();

                const itemNames = await readDirectoryAsync(uri);

                if (itemNames.length) {
                    const subItemsPromises = itemNames.map(
                        (itemName) =>
                            new Promise<LibItemType>((resolve, reject) =>
                                getInfoAsync(uri + itemName)
                                    .then((subItemInfo) =>
                                        resolve({
                                            name: itemName,
                                            isDirectory: subItemInfo.isDirectory,
                                            uri: subItemInfo.uri
                                        })
                                    )
                                    .catch(reject)
                            )
                    );
                    let subItems = await Promise.all(subItemsPromises);
                    const downloadedItemNames =
                        uri === documentDirectory
                            ? subItems.filter((subItem) => !subItem.isDirectory).map((subItem) => subItem.name)
                            : store[LIB_TYPE.LOCAL].downloadedItemNames;

                    subItems = subItems
                        .filter((subItem) => !LOCAL_ITEMS_TO_HIDE.includes(subItem.name))
                        .sort((subItem1, subItem2) => (subItem1.isDirectory === subItem2.isDirectory ? 1 : -1))
                        .map((subItem) => ({
                            ...subItem,
                            isRemote: false
                        }));

                    store.set(LIB_TYPE.LOCAL, {
                        ...store[LIB_TYPE.LOCAL],
                        subItems,
                        downloadedItemNames
                    });
                }

                onEnd?.();
            }
        },
        [store[LIB_TYPE.LOCAL].curItem]
    );
    const deleteItem = useCallback(
        async (itemURI: string, config: ConfigType = {}) => {
            const { onStart, onEnd } = config;

            onStart?.();

            await deleteAsync(itemURI, { idempotent: true });

            onEnd?.();
        },
        [deleteAsync]
    );

    return {
        getItem,
        getSubItems,
        deleteItem
    };
};

export default useLocalLib;
