import AsyncStorage from '@react-native-async-storage/async-storage';
import { RemoteLibItemType } from '@src/@types';
import store from '@src/store';
import {
    DownloadProgressData,
    DownloadResumable,
    createDownloadResumable,
    cacheDirectory,
    documentDirectory,
    moveAsync,
    readDirectoryAsync,
    getInfoAsync
} from 'expo-file-system';
import { useCallback } from 'react';

const EXPO_PUBLIC_API_SERVER_HOSTNAME = process.env.EXPO_PUBLIC_API_SERVER_HOSTNAME;

const useDownload = () => {
    const callback = useCallback(({ totalBytesWritten, totalBytesExpectedToWrite }: DownloadProgressData) => {
        const value = Number((totalBytesWritten / totalBytesExpectedToWrite).toFixed(2));

        store.set('app', {
            ...store.app,
            progressbar: {
                isProgressBarVisible: isNaN(value) ? false : value !== 0 && value !== 1,
                value: isNaN(value) ? undefined : value
            }
        });
    }, []);
    const getResumableInfo = useCallback(
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

                    return {
                        isNewDownload: false,
                        downloadResumable: new DownloadResumable(
                            snapshot.url,
                            snapshot.fileUri,
                            options,
                            callback,
                            snapshot.resumeData
                        )
                    };
                } catch (e) {
                    console.error(e);
                }
            } else {
                const downloadResumable = createDownloadResumable(url, cacheDirectory + item.name, options, callback);

                return {
                    isNewDownload: true,
                    downloadResumable
                };
            }
        },
        [store.authInfo.accessToken, callback, createDownloadResumable]
    );
    const download = useCallback(
        async (item: RemoteLibItemType) => {
            const accessToken = store.authInfo.accessToken;
            const resumableInfo = await getResumableInfo(item);
            let result = null;

            if (!accessToken || !resumableInfo) {
                return null;
            }

            try {
                const { isNewDownload, downloadResumable } = resumableInfo;

                if (isNewDownload) {
                    result = await downloadResumable.downloadAsync();
                } else {
                    result = await downloadResumable.resumeAsync();
                }

                if (result?.uri && documentDirectory) {
                    await AsyncStorage.removeItem(item.name);
                    await moveAsync({
                        from: result?.uri,
                        to: documentDirectory + item.name
                    });
                }
            } catch (e) {
                console.error(e);
            }
        },
        [store.authInfo.accessToken, getResumableInfo, moveAsync]
    );
    const pause = useCallback(
        async (item: RemoteLibItemType) => {
            const accessToken = store.authInfo.accessToken;
            const resumableInfo = await getResumableInfo(item);

            if (!accessToken || !resumableInfo) {
                return null;
            }

            try {
                const { downloadResumable } = resumableInfo;

                await downloadResumable.pauseAsync();

                console.log('Paused download operation, saving for future retrieval');

                AsyncStorage.setItem(item.name, JSON.stringify(downloadResumable.savable()));
            } catch (e) {
                console.error(e);
            }
        },
        [store.authInfo.accessToken, getResumableInfo]
    );

    return {
        download,
        pause
    };
};

export default useDownload;
