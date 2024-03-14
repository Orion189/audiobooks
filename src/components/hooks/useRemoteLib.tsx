import AsyncStorage from '@react-native-async-storage/async-storage';
import { RemoteLibItemType } from '@src/@types';
import { REMOTE_LIB_ITEM_TYPE, LIB_TYPE } from '@src/enums';
import * as remoteService from '@src/services/remote.service';
import store from '@src/store';
import {
    DownloadProgressData,
    DownloadResumable,
    createDownloadResumable,
    cacheDirectory,
    documentDirectory,
    moveAsync,
    FileSystemDownloadResult
} from 'expo-file-system';
import { useCallback, useRef, useState } from 'react';

type ConfigType = {
    onStart?: () => void;
    onEnd?: () => void;
};

const EXPO_PUBLIC_API_SERVER_HOSTNAME = process.env.EXPO_PUBLIC_API_SERVER_HOSTNAME;

const useRemoteLib = () => {
    const [progress, setProgress] = useState(0);
    const downloadResumableRef = useRef<DownloadResumable | undefined>();
    const callback = useCallback(
        (progressData: DownloadProgressData) => {
            const { totalBytesWritten, totalBytesExpectedToWrite } = progressData;
            const value = Number((totalBytesWritten / totalBytesExpectedToWrite).toFixed(2));

            setProgress(value);
        },
        [setProgress]
    );
    const downloadResultHandler = useCallback(
        async (result: FileSystemDownloadResult, item: RemoteLibItemType) => {
            try {
                if (result?.uri && documentDirectory) {
                    AsyncStorage.removeItem(item.name).then(() => {
                        moveAsync({
                            from: result?.uri,
                            to: documentDirectory + item.name
                        }).then(() => {
                            const downloadedItemNamesOld = store[LIB_TYPE.LOCAL].downloadedItemNames;
                            const isExistedItem = downloadedItemNamesOld?.find((itemName) => itemName === item.name);
                            const downloadedItemNames = [...downloadedItemNamesOld, item.name];

                            if (!isExistedItem) {
                                store.set(LIB_TYPE.LOCAL, {
                                    ...store[LIB_TYPE.LOCAL],
                                    downloadedItemNames
                                });
                            }

                            downloadResumableRef.current = undefined;
                        });
                    });
                }
            } catch (e) {
                console.error(e);
            }
        },
        [moveAsync]
    );
    const download = useCallback(
        async (item: RemoteLibItemType) => {
            const url = `${EXPO_PUBLIC_API_SERVER_HOSTNAME}/files/${item.id}?alt=media`;
            const accessToken = store.authInfo.accessToken;
            const snapshotJson = await AsyncStorage.getItem(item.name);
            const options = {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            };

            if (!accessToken) {
                return null;
            }

            if (snapshotJson) {
                try {
                    const snapshot = JSON.parse(snapshotJson);
                    const downloadResumable = new DownloadResumable(
                        snapshot.url,
                        snapshot.fileUri,
                        options,
                        callback,
                        snapshot.resumeData
                    );

                    return downloadResumable
                        .resumeAsync()
                        .then((result) => result && downloadResultHandler(result, item));
                } catch (e) {
                    console.error(e);
                }
            } else {
                const downloadResumable = createDownloadResumable(url, cacheDirectory + item.name, options, callback);

                downloadResumableRef.current = downloadResumable;

                return downloadResumableRef.current
                    .downloadAsync()
                    .then((result) => result && downloadResultHandler(result, item));
            }
        },
        [store.authInfo.accessToken, createDownloadResumable, downloadResumableRef.current]
    );
    const pause = useCallback(
        async (item: RemoteLibItemType) => {
            const accessToken = store.authInfo.accessToken;
            const downloadResumable = downloadResumableRef.current;

            if (!accessToken || !downloadResumable) {
                return null;
            }

            try {
                downloadResumable
                    .pauseAsync()
                    .then(() => AsyncStorage.setItem(item.name, JSON.stringify(downloadResumable.savable())));
            } catch (e) {
                console.error(e);
            }
        },
        [store.authInfo.accessToken, downloadResumableRef.current]
    );
    const getItem = useCallback(
        async (id: string, config: ConfigType = {}) => {
            if (store.authInfo.accessToken) {
                const { onStart, onEnd } = config;
                const fileData = await remoteService.apiRequest({
                    path: `/files/${id}`,
                    fields: 'id,name,mimeType,parents,size',
                    onStart,
                    onEnd
                });

                if (fileData?.id) {
                    store.set(LIB_TYPE.REMOTE, {
                        ...store[LIB_TYPE.REMOTE],
                        curItem: fileData,
                        subItems: []
                    });
                }
            }
        },
        [store.authInfo.accessToken]
    );
    const getSubItems = useCallback(
        async (config: ConfigType = {}) => {
            const id = store[LIB_TYPE.REMOTE].curItem?.id;
            const accessToken = store.authInfo.accessToken;

            if (id && accessToken) {
                const { onStart, onEnd } = config;
                const filesData = await remoteService.apiRequest({
                    path: '/files',
                    orderBy: 'folder,name',
                    q: `
                        parents in '${id}' 
                        and mimeType in '${REMOTE_LIB_ITEM_TYPE.G_FOLDER}','${REMOTE_LIB_ITEM_TYPE.MPEG}' 
                        and trashed = false
                    `,
                    fields: 'files(id,name,mimeType,parents,size)',
                    onStart,
                    onEnd
                });

                if (filesData?.files.length) {
                    store.set(LIB_TYPE.REMOTE, {
                        ...store[LIB_TYPE.REMOTE],
                        subItems: filesData?.files
                    });
                }
            }
        },
        [store[LIB_TYPE.REMOTE].curItem, store.authInfo.accessToken]
    );

    return {
        getItem,
        getSubItems,
        download,
        pause,
        progress
    };
};

export default useRemoteLib;
