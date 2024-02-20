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

type ConfigType = {
    onStart?: () => void;
    onEnd?: () => void;
};

const EXPO_PUBLIC_API_SERVER_HOSTNAME = process.env.EXPO_PUBLIC_API_SERVER_HOSTNAME;

const useDownload = () => {
    const [downloadProgress, setDownloadProgress] = useState(0);
    const callback = useCallback(
        (progress: DownloadProgressData) => {
            const downloadProgress = progress.totalBytesWritten / progress.totalBytesExpectedToWrite;

            setDownloadProgress(downloadProgress);
        },
        [setDownloadProgress]
    );
    const getResumable = useCallback(
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
                const snapshot = JSON.parse(snapshotJson);

                return new DownloadResumable(snapshot.url, snapshot.fileUri, options, callback, snapshot.resumeData);
            } else {
                return createDownloadResumable(url, cacheDirectory + item.name, options, callback);
            }
        },
        [store.authInfo.accessToken]
    );
    const download = useCallback(
        async (item: RemoteLibItemType, downloadResumable: DownloadResumable) => {
            if (!store.authInfo.accessToken) {
                return null;
            }

            try {
                const result = await downloadResumable.downloadAsync();
                // TODO: save to documentDirectory and remove from cacheDirectory
                // TODO: incapsulate getResumable and resume calls here
                console.log('Finished downloading to ', result?.uri);
                await AsyncStorage.removeItem(item.name);

                return result?.uri;
            } catch (e) {
                console.error(e);
            }
        },
        [store.authInfo.accessToken]
    );
    const pause = useCallback(
        async (item: RemoteLibItemType, downloadResumable: DownloadResumable) => {
            if (!store.authInfo.accessToken) {
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
        [store.authInfo.accessToken]
    );
    const resume = useCallback(
        async (downloadResumable: DownloadResumable) => {
            if (!store.authInfo.accessToken) {
                return null;
            }

            try {
                const result = await downloadResumable.resumeAsync();

                console.log('Finished downloading to ', result?.uri);
                return result?.uri;
            } catch (e) {
                console.error(e);
            }
        },
        [store.authInfo.accessToken]
    );

    return {
        downloadProgress,
        getResumable,
        download,
        pause,
        resume
    };
};

export default useDownload;
