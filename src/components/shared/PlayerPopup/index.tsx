import PlayerPopupView from '@src/components/shared/PlayerPopup/PlayerPopup';
import store from '@src/store';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

const PlayerPopup = observer(() => {
    const onCollapse = useCallback(() => {
        store.set('player', { ...store.player, isCollapsed: true });
    }, [store.player.isCollapsed]);
    const onClose = useCallback(() => {
        store.set('player', { ...store.player, isVisible: false });
    }, [store.player.isVisible]);
    const expandPlayer = useCallback(() => {
        store.set('player', { ...store.player, isCollapsed: false });
    }, [store.player.isCollapsed]);

    return store.player.isVisible ? (
        <PlayerPopupView onClose={onClose} onCollapse={onCollapse} expandPlayer={expandPlayer} />
    ) : null;
});

export default PlayerPopup;
