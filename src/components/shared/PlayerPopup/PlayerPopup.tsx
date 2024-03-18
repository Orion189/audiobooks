import Collapsed from '@src/components/shared/PlayerPopup/Collapsed';
import Expanded from '@src/components/shared/PlayerPopup/Expanded';
import store from '@src/store';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';

type PlayerPopupProps = {
    expandPlayer: () => void;
    onCollapse: () => void;
    onClose: () => void;
    playPrevItem: () => void;
    playNextItem: () => void;
};

const PlayerPopup: FC<PlayerPopupProps> = observer(
    ({ expandPlayer, onCollapse, onClose, playPrevItem, playNextItem }) =>
        store.player.isCollapsed ? (
            <Collapsed expandPlayer={expandPlayer} onClose={onClose} />
        ) : (
            <Expanded onCollapse={onCollapse} playPrevItem={playPrevItem} playNextItem={playNextItem} />
        )
);

export default PlayerPopup;
