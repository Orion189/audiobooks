import PlayerPopupView from '@src/components/shared/PlayerPopup/PlayerPopup';
import { LIB_TYPE } from '@src/enums';
import store from '@src/store';
import { AVPlaybackStatus, Audio } from 'expo-av';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';

const EXPO_PUBLIC_API_SERVER_HOSTNAME = process.env.EXPO_PUBLIC_API_SERVER_HOSTNAME;

const PlayerPopup = observer(() => {
    const init = useCallback(async () => {
        await Audio.setAudioModeAsync({
            playThroughEarpieceAndroid: true,
            playsInSilentModeIOS: true,
            staysActiveInBackground: true
        });
    }, [Audio.setAudioModeAsync]);
    const onCollapse = useCallback(() => {
        store.set('player', { ...store.player, isCollapsed: true });
    }, []);
    const onClose = useCallback(async () => {
        if (store.player.sound) {
            await store.player.sound?.stopAsync();
            await store.player.sound?.unloadAsync();
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
            const { isPlaying, positionMillis, durationMillis, didJustFinish, isLooping } = status;

            store.set('player', {
                ...store.player,
                isPlaying,
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
        const { volume, itemId } = store.player;
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

        if (store.player.sound) {
            await store.player.sound?.stopAsync();
            await store.player.sound?.unloadAsync();
        }

        try {
            const { sound, status } = await Audio.Sound.createAsync(
                { uri, ...options },
                { isLooping: false, volume },
                onPlaybackStatusUpdate
            );

            if (status.isLoaded) {
                store.set('player', { ...store.player, sound });

                await sound.playAsync();
            }
        } catch (error) {
            console.error(error);
        }
    }, [onPlaybackStatusUpdate, store.authInfo.accessToken, store.player.itemId, store.player.volume]);

    useEffect(() => {
        if (store.player.itemName) {
            switch (store.lib.curLib) {
                case LIB_TYPE.REMOTE: {
                    createRemoteSound();
                    break;
                }
            }
        }
    }, [store.player.itemName]);

    useEffect(() => {
        init();
    }, [init]);

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
