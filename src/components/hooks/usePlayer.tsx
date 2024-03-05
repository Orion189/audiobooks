import { LocalLibItemType } from '@src/@types';
import { LOCAL_ITEMS_TO_HIDE } from '@src/constants';
import { LIB_TYPE } from '@src/enums';
import store from '@src/store';
import { AVPlaybackStatus, Audio } from 'expo-av';
import { useCallback, useEffect, useState } from 'react';

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
    const [sound, setSound] = useState<Audio.Sound | undefined>();
    const onMount = useCallback(async () => {
        await Audio.setAudioModeAsync({
            playThroughEarpieceAndroid: true,
            playsInSilentModeIOS: true,
            staysActiveInBackground: true
        });
    }, [Audio.setAudioModeAsync]);
    const onUnmount = useCallback(() => {
        sound && sound.unloadAsync();
    }, [sound]);
    const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
        console.log(status);
        if (!status.isLoaded) {
            if (status.error) {
                console.error(`Encountered a fatal error during playback: ${status.error}`);
            }
        } else {
            if (status.isPlaying) {
                store.set('player', {
                    ...store.player,
                    item: {
                        ...store.player.item,
                        duration: status.durationMillis,
                        position: status.positionMillis
                    }
                });
            } else {
                // Update your UI for the paused state
            }

            if (status.isBuffering) {
                // Update your UI for the buffering state
            }

            if (status.didJustFinish && !status.isLooping) {
                // The player has just finished playing and will stop. Maybe you want to play something else?
            }
        }
    }, []);
    const playLocalFile = useCallback(
        async (itemURI: string, config: ConfigType = {}) => {
            const { onStart, onEnd } = config;

            onStart && onStart();

            const { exists, isDirectory, uri } = await getInfoAsync(itemURI);

            if (exists) {
                store.set(LIB_TYPE.LOCAL, {
                    ...store[LIB_TYPE.LOCAL],
                    curItem: {
                        name: '',
                        isDirectory,
                        uri
                    },
                    subItems: []
                });
            }

            onEnd && onEnd();
        },
        [getInfoAsync]
    );
    const playRemoteFile = useCallback(
        async (item: RemoteFileType) => {
            const uri = `${EXPO_PUBLIC_API_SERVER_HOSTNAME}/files/${item.id}?alt=media`;
            const accessToken = store.authInfo.accessToken;
            const options = {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            };

            if (!accessToken) {
                return null;
            }

            try {
                const { sound, status } = await Audio.Sound.createAsync(
                    { uri, ...options },
                    { isLooping: false, volume: store.player.volume },
                    onPlaybackStatusUpdate
                );

                if (status.isLoaded) {
                    setSound(sound);

                    sound.playAsync();
                }
            } catch (error) {
                console.error(error);
            }
        },
        [onPlaybackStatusUpdate, setSound]
    );

    useEffect(() => {
        //store.reset('player');
        onMount();
    }, [onMount]);

    useEffect(() => {
        return sound ? onUnmount() : undefined;
    }, [sound, onUnmount]);

    return {
        playLocalFile,
        playRemoteFile
    };
};

export default usePlayer;
