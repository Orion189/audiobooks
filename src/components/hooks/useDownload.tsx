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
    FileSystemDownloadResult
} from 'expo-file-system';
import { useCallback, useRef, useState } from 'react';

const EXPO_PUBLIC_API_SERVER_HOSTNAME = process.env.EXPO_PUBLIC_API_SERVER_HOSTNAME;

const useDownload = () => {
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
                        });

                        downloadResumableRef.current = undefined;
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

    return {
        download,
        pause,
        progress
    };
};

export default useDownload;
