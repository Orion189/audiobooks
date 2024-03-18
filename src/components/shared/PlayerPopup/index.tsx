import usePlayer from '@src/components/hooks/usePlayer';
import PlayerPopupView from '@src/components/shared/PlayerPopup/PlayerPopup';
import { LIB_TYPE } from '@src/enums';
import store from '@src/store';
import { Audio } from 'expo-av';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';

const PlayerPopup = observer(() => {
    const { createRemoteSound, openRemoteFile, getRemotePrevPlayItem, getRemoteNextPlayItem } = usePlayer();
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
    const playPrevItem = useCallback(async () => {
        switch (store.lib.curLib) {
            case LIB_TYPE.REMOTE: {
                const prevItem = getRemotePrevPlayItem();

                if (prevItem) {
                    openRemoteFile(prevItem);
                }
                break;
            }
        }
    }, [store.lib.curLib, getRemotePrevPlayItem, openRemoteFile]);
    const playNextItem = useCallback(async () => {
        switch (store.lib.curLib) {
            case LIB_TYPE.REMOTE: {
                const nextItem = getRemoteNextPlayItem();

                if (nextItem) {
                    openRemoteFile(nextItem);
                }
                break;
            }
        }
    }, [store.lib.curLib, getRemoteNextPlayItem, openRemoteFile]);
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
        <PlayerPopupView
            onClose={onClose}
            onCollapse={onCollapse}
            expandPlayer={expandPlayer}
            playPrevItem={playPrevItem}
            playNextItem={playNextItem}
        />
    ) : null;
});

export default PlayerPopup;
