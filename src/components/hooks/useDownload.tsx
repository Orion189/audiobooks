import AsyncStorage from '@react-native-async-storage/async-storage';
import { RemoteLibItemType } from '@src/@types';
import store from '@src/store';
import {
    DownloadProgressData,
    DownloadResumable,
    createDownloadResumable,
    cacheDirectory,
    documentDirectory
} from 'expo-file-system';
import { useCallback, useState } from 'react';

const EXPO_PUBLIC_API_SERVER_HOSTNAME = process.env.EXPO_PUBLIC_API_SERVER_HOSTNAME;

const useDownload = () => {
    const [downloadProgress, setDownloadProgress] = useState(0);
    const callback = useCallback(
        ({ totalBytesWritten, totalBytesExpectedToWrite }: DownloadProgressData) => {
            setDownloadProgress(totalBytesWritten / totalBytesExpectedToWrite);
        },
        [setDownloadProgress]
    );
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
                return {
                    isNewDownload: true,
                    downloadResumable: createDownloadResumable(url, cacheDirectory + item.name, options, callback)
                };
            }
        },
        [store.authInfo.accessToken, callback]
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

                // TODO: save to documentDirectory and remove from cacheDirectory
                await AsyncStorage.removeItem(item.name);

                return result?.uri;
            } catch (e) {
                console.error(e);
            }
        },
        [store.authInfo.accessToken, getResumableInfo, downloadProgress]
    );
    const pause = useCallback(
        async (item: RemoteLibItemType) => {
            const accessToken = store.authInfo.accessToken;
            const downloadResumable = await getResumableInfo(item);

            if (!accessToken || !downloadResumable) {
                return null;
            }

            try {
                await downloadResumable.pauseAsync();

                console.log('Paused download operation, saving for future retrieval');

                AsyncStorage.setItem(item.name, JSON.stringify(downloadResumable.savable()));
            } catch (e) {
                console.error(e);
            }
        },
        [store.authInfo.accessToken, getResumableInfo]
    );

    console.log(downloadProgress.toFixed(2));

    return {
        download,
        pause
    };
};

export default useDownload;
