import { RemoteLibItemType } from '@src/@types';
import useRemoteLib from '@src/components/hooks/useRemoteLib';
import RemoteLibraryView from '@src/components/main/RemoteLibrary/RemoteLibrary';
import Loading from '@src/components/shared/Loading';
import { LIB_TYPE } from '@src/enums';
import store from '@src/store';
import { AVPlaybackStatus, Audio } from 'expo-av';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';

const EXPO_PUBLIC_API_SERVER_HOSTNAME = process.env.EXPO_PUBLIC_API_SERVER_HOSTNAME;

const RemoteLibrary = observer(() => {
    const { getItem, getSubItems } = useRemoteLib();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const onStart = useCallback(() => store.set('app', { ...store.app, isLoadingVisible: true }), []);
    const onEnd = useCallback(() => store.set('app', { ...store.app, isLoadingVisible: false }), []);
    const onRefreshStart = useCallback(() => setIsRefreshing(true), []);
    const onRefreshEnd = useCallback(() => setIsRefreshing(false), []);
    const onRefresh = useCallback(() => {
        getSubItems({
            onStart: onRefreshStart,
            onEnd: onRefreshEnd
        });
    }, [getSubItems]);
    const openFolder = useCallback((item: RemoteLibItemType) => {
        store.set(LIB_TYPE.REMOTE, {
            ...store[LIB_TYPE.REMOTE],
            curItem: item,
            subItems: []
        });
    }, []);
    const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
        if (!status.isLoaded) {
            if (status.error) {
                console.error(`Encountered a fatal error during playback: ${status.error}`);
            }
        } else {
            const { isPlaying, positionMillis, durationMillis, didJustFinish, isLooping, volume } = status;

            store.set('player', {
                ...store.player,
                isPlaying,
                volume: Number(volume.toPrecision(1)),
                duration: durationMillis,
                position: positionMillis
            });

            if (didJustFinish && !isLooping) {
                // The player has just finished playing and will stop. Maybe you want to play something else?
            }
        }
    }, []);
    const openFile = useCallback(
        async (item: RemoteLibItemType) => {
            const accessToken = store.authInfo.accessToken;
            const { volume } = store.player;
            const uri = `${EXPO_PUBLIC_API_SERVER_HOSTNAME}/files/${item.id}?alt=media`;
            const options = {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            };

            if (!accessToken || !item.id) {
                return null;
            }

            try {
                const curStatus = await store.player.sound?.getStatusAsync?.();

                if (curStatus?.isLoaded === true) {
                    await store.player.sound?.stopAsync?.();
                    await store.player.sound?.unloadAsync?.();
                }

                if (curStatus?.isLoaded === true || curStatus?.isLoaded === undefined) {
                    const { sound, status } = await Audio.Sound.createAsync(
                        { uri, ...options },
                        { isLooping: false, volume, positionMillis: 0, shouldPlay: true },
                        onPlaybackStatusUpdate
                    );

                    if (status.isLoaded) {
                        console.log(store[LIB_TYPE.REMOTE].subItems);
                        store.set('player', {
                            ...store.player,
                            isVisible: true,
                            sound,
                            itemId: item.id,
                            itemName: item.name
                        });
                    }
                }
            } catch (error) {
                console.error(error);
            }
        },
        [store.player.volume, store.player.sound, store.authInfo.accessToken]
    );

    useEffect(() => {
        getItem('root', {
            onStart,
            onEnd
        });
    }, [getItem, onStart, onEnd]);

    useEffect(() => {
        getSubItems({
            onStart,
            onEnd
        });
    }, [getSubItems, onStart, onEnd]);

    return store.app.isLoadingVisible ? (
        <Loading />
    ) : (
        <RemoteLibraryView
            openFile={openFile}
            onRefresh={onRefresh}
            openFolder={openFolder}
            isRefreshing={isRefreshing}
        />
    );
});

export default RemoteLibrary;
