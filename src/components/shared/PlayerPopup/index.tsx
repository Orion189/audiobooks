import PlayerPopupView from '@src/components/shared/PlayerPopup/PlayerPopup';
import { LIB_TYPE } from '@src/enums';
import store from '@src/store';
import { AVPlaybackStatus, Audio } from 'expo-av';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';

const EXPO_PUBLIC_API_SERVER_HOSTNAME = process.env.EXPO_PUBLIC_API_SERVER_HOSTNAME;

const PlayerPopup = observer(() => {
    const onCollapse = useCallback(() => {
        store.set('player', { ...store.player, isCollapsed: true });
    }, []);
    const onClose = useCallback(async () => {
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
            duration: 0,
            position: 0,
            itemId: '',
            itemName: '',
            itemURI: ''
        });
    }, [store.player.sound]);
    const expandPlayer = useCallback(() => {
        store.set('player', { ...store.player, isCollapsed: false });
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
    const createRemoteSound = useCallback(async () => {
        const accessToken = store.authInfo.accessToken;
        const { volume, itemId, position } = store.player;
        const uri = `${EXPO_PUBLIC_API_SERVER_HOSTNAME}/files/${itemId}?alt=media`;
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
                    { uri, ...options },
                    { isLooping: false, volume, positionMillis: position, shouldPlay: false },
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
    }, [
        store.authInfo.accessToken,
        store.player.volume,
        store.player.itemId,
        store.player.itemName,
        store.player.position
    ]);
    const init = useCallback(async () => {
        await Audio.setAudioModeAsync({
            playThroughEarpieceAndroid: true,
            playsInSilentModeIOS: true,
            staysActiveInBackground: true
        });

        switch (store.lib.curLib) {
            case LIB_TYPE.REMOTE: {
                await createRemoteSound();
                break;
            }
        }
    }, [Audio.setAudioModeAsync, store.lib.curLib]);

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        return () => {
            onClose();
        };
    }, []);

    return store.player.isVisible ? (
        <PlayerPopupView onClose={onClose} onCollapse={onCollapse} expandPlayer={expandPlayer} />
    ) : null;
});

export default PlayerPopup;
