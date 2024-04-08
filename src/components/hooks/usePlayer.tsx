import { LibItemType } from '@src/@types';
import { LIB_TYPE } from '@src/enums';
import store from '@src/store';
import { AVPlaybackStatus, Audio } from 'expo-av';
import { useCallback } from 'react';

const usePlayer = () => {
    const stopPlayback = useCallback(async () => {
        try {
            await store.player.sound?.stopAsync?.();
            await store.player.sound?.unloadAsync?.();
        } catch (e) {
            console.error(e);
        }

        store.set('player', {
            ...store.player,
            isVisible: false,
            sound: null,
            rate: 1,
            duration: 0,
            position: 0,
            itemId: '',
            itemName: '',
            itemURI: ''
        });
    }, [store.player.sound]);
    const getRemotePrevPlayItem = useCallback(() => {
        const playlist = store[LIB_TYPE.REMOTE].subItems?.filter((subItem) => !subItem.isDirectory);

        if (playlist) {
            const itemIndex = playlist.findIndex((item) => item.id === store.player.itemId);
            const prevItem = itemIndex === 0 ? null : playlist[itemIndex - 1];

            return prevItem;
        }
    }, [store[LIB_TYPE.REMOTE].subItems, store.player.itemId]);
    const getRemoteNextPlayItem = useCallback(() => {
        const playlist = store[LIB_TYPE.REMOTE].subItems?.filter((subItem) => !subItem.isDirectory);

        if (playlist) {
            const itemIndex = playlist.findIndex((item) => item.id === store.player.itemId);
            const nextItem = itemIndex === playlist.length - 1 ? null : playlist[itemIndex + 1];

            return nextItem;
        }
    }, [store[LIB_TYPE.REMOTE].subItems, store.player.itemId]);
    const getLocalPrevPlayItem = useCallback(() => {
        const playlist = store[LIB_TYPE.LOCAL].subItems?.filter((subItem) => subItem.isDirectory === false);

        if (playlist) {
            const itemIndex = playlist.findIndex((item) => item.name === store.player.itemName);
            const prevItem = itemIndex === 0 ? null : playlist[itemIndex - 1];

            return prevItem;
        }
    }, [store[LIB_TYPE.REMOTE].subItems, store.player.itemId]);
    const getLocalNextPlayItem = useCallback(() => {
        const playlist = store[LIB_TYPE.LOCAL].subItems?.filter((subItem) => subItem.isDirectory === false);

        if (playlist) {
            const itemIndex = playlist.findIndex((item) => item.name === store.player.itemName);
            const nextItem = itemIndex === playlist.length - 1 ? null : playlist[itemIndex + 1];

            return nextItem;
        }
    }, [store[LIB_TYPE.LOCAL].subItems, store.player.itemName]);
    const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
        if (!status.isLoaded) {
            if (status.error) {
                console.error(`Encountered a fatal error during playback: ${status.error}`);
            }
        } else {
            const { isPlaying, positionMillis, durationMillis, didJustFinish, isLooping, volume, rate } = status;

            store.set('player', {
                ...store.player,
                isPlaying,
                volume: Number(volume.toPrecision(1)),
                duration: durationMillis,
                position: positionMillis,
                rate
            });

            if (didJustFinish && !isLooping) {
                onDidJustFinish();
            }
        }
    }, []);
    const openRemoteFile = useCallback(
        async (item: LibItemType) => {
            const accessToken = store.authInfo.accessToken;
            const { volume, rate } = store.player;
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
                        { uri: item.uri, ...options },
                        { isLooping: false, volume, rate, positionMillis: 0, shouldPlay: true },
                        onPlaybackStatusUpdate
                    );

                    if (status.isLoaded) {
                        store.set('history', [item, ...store.history.filter((libItem) => libItem.uri !== item.uri)]);
                        store.set('player', {
                            ...store.player,
                            isVisible: true,
                            sound,
                            itemURI: item.uri,
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
    const onDidJustFinish = useCallback(async () => {
        switch (store.lib.curLib) {
            case LIB_TYPE.REMOTE: {
                const nextItem = getRemoteNextPlayItem();

                if (nextItem) {
                    openRemoteFile(nextItem);
                } else {
                    stopPlayback();
                }

                break;
            }
            case LIB_TYPE.LOCAL: {
                const nextItem = getLocalNextPlayItem();

                if (nextItem) {
                    openLocalFile(nextItem);
                } else {
                    stopPlayback();
                }

                break;
            }
        }
    }, [store.lib.curLib, getRemoteNextPlayItem, openRemoteFile, stopPlayback]);
    const createRemoteSound = useCallback(async () => {
        const accessToken = store.authInfo.accessToken;
        const { volume, rate, itemId, itemURI, position } = store.player;
        const options = {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        };

        if (!accessToken || !itemId) {
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
                    { uri: itemURI, ...options },
                    { isLooping: false, volume, rate, positionMillis: position, shouldPlay: false },
                    onPlaybackStatusUpdate
                );

                if (status.isLoaded) {
                    store.set('player', {
                        ...store.player,
                        sound
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    }, [store.authInfo.accessToken, store.player.volume, store.player.itemId, store.player.position]);
    const openLocalFile = useCallback(
        async (item: LibItemType) => {
            const { volume, rate } = store.player;

            if (!item.uri) {
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
                        { uri: item.uri },
                        { isLooping: false, volume, rate, positionMillis: 0, shouldPlay: true },
                        onPlaybackStatusUpdate
                    );

                    if (status.isLoaded) {
                        store.set('history', [item, ...store.history.filter((libItem) => libItem.uri !== item.uri)]);
                        store.set('player', {
                            ...store.player,
                            isVisible: true,
                            sound,
                            itemId: '',
                            itemURI: item.uri,
                            itemName: item.name
                        });
                    }
                }
            } catch (error) {
                console.error(error);
            }
        },
        [store.player.volume, store.player.sound, store.history]
    );
    const createLocalSound = useCallback(async () => {
        const { volume, rate, itemURI, position } = store.player;

        if (!itemURI) {
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
                    { uri: itemURI },
                    { isLooping: false, volume, rate, positionMillis: position, shouldPlay: false },
                    onPlaybackStatusUpdate
                );

                if (status.isLoaded) {
                    store.set('player', {
                        ...store.player,
                        sound
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    }, [store.player.volume, store.player.itemURI, store.player.position]);

    return {
        openLocalFile,
        openRemoteFile,
        createLocalSound,
        createRemoteSound,
        getLocalPrevPlayItem,
        getLocalNextPlayItem,
        getRemotePrevPlayItem,
        getRemoteNextPlayItem
    };
};

export default usePlayer;
