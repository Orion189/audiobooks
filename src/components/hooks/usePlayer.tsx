import store from '@src/store';
import { AVPlaybackStatus, Audio } from 'expo-av';
import { useCallback, useEffect, useRef } from 'react';

type LocalFileType = {
    name: string;
    uri: string;
};

type RemoteFileType = {
    id: string;
    name: string;
};

const EXPO_PUBLIC_API_SERVER_HOSTNAME = process.env.EXPO_PUBLIC_API_SERVER_HOSTNAME;

const usePlayer = () => {
    const soundRef = useRef<Audio.Sound | undefined>();
    const init = useCallback(async () => {
        await Audio.setAudioModeAsync({
            playThroughEarpieceAndroid: true,
            playsInSilentModeIOS: true,
            staysActiveInBackground: true
        });
    }, [Audio.setAudioModeAsync]);
    const closePlayer = useCallback(async () => {
        console.log('sound:', soundRef.current);
        if (soundRef.current) {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
        }
    }, [soundRef.current]);
    const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
        if (!status.isLoaded) {
            if (status.error) {
                console.error(`Encountered a fatal error during playback: ${status.error}`);
            }
        } else {
            const { isPlaying, positionMillis, durationMillis, isBuffering, didJustFinish, isLooping } = status;

            if (isPlaying && positionMillis && durationMillis) {
                store.set('player', {
                    ...store.player,
                    duration: durationMillis,
                    position: positionMillis
                });
            } else {
                store.set('player', {
                    ...store.player,
                    duration: 0,
                    position: 0
                });
            }

            if (isBuffering) {
                // Update your UI for the buffering state
            }

            if (didJustFinish && !isLooping) {
                // The player has just finished playing and will stop. Maybe you want to play something else?
            }
        }
    }, []);
    const createLocalSound = useCallback(async (itemURI: string) => {}, []);
    const createRemoteSound = useCallback(async () => {
        const accessToken = store.authInfo.accessToken;
        const id = store.playerItem.id;
        const volume = store.player.volume;
        const uri = `${EXPO_PUBLIC_API_SERVER_HOSTNAME}/files/${id}?alt=media`;
        const options = {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        };

        if (!accessToken || !id) {
            return null;
        }

        await unload();

        try {
            const { sound, status } = await Audio.Sound.createAsync(
                { uri, ...options },
                { isLooping: false, volume },
                onPlaybackStatusUpdate
            );

            if (status.isLoaded) {
                soundRef.current = sound;

                store.set('playerItem', { ...store.playerItem, isLoaded: true });
            }
        } catch (error) {
            console.error(error);
        }
    }, [
        onPlaybackStatusUpdate,
        soundRef.current,
        store.authInfo.accessToken,
        store.playerItem.id,
        store.player.volume
    ]);
    const unload = useCallback(async () => {
        if (soundRef.current) {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
        }
    }, [soundRef.current]);
    const play = useCallback(async () => {
        const { position } = store.player;

        await soundRef.current?.playFromPositionAsync(position);
    }, [soundRef.current]);
    const pause = useCallback(async () => {
        await soundRef.current?.pauseAsync();
    }, [soundRef.current]);
    const setVolume = useCallback(
        async (volume: number) => {
            await soundRef.current?.setVolumeAsync(volume);
        },
        [soundRef.current]
    );

    useEffect(() => {
        const { name, isLoaded, isPlaying, isRemote } = store.playerItem;

        if (name) {
            if (isLoaded) {
                if (isPlaying) {
                    pause();
                } else {
                    play();
                }
            } else {
                if (isRemote) {
                    createRemoteSound();
                } else {
                    //createLocalSound();
                }
            }
        } else {
            unload();
        }
    }, [store.playerItem]);

    useEffect(() => {
        setVolume(store.player.volume);
    }, [store.player.volume]);

    useEffect(() => {
        init();
    }, [init]);

    useEffect(() => {
        return soundRef.current
            ? () => {
                  console.log('unLoad');
                  soundRef.current?.unloadAsync();
                  soundRef.current = undefined;
              }
            : undefined;
    }, [soundRef.current]);

    return null;
};

export default usePlayer;
