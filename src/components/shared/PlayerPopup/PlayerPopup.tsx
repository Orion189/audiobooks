import Collapsed from '@src/components/shared/PlayerPopup/Collapsed';
import Expanded from '@src/components/shared/PlayerPopup/Expanded';
import store from '@src/store';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { useWindowDimensions } from 'react-native';

type PlayerPopupProps = {
    expandPlayer: () => void;
    onCollapse: () => void;
    onClose: () => void;
    playPrevItem: () => void;
    playNextItem: () => void;
};

const PlayerPopup: FC<PlayerPopupProps> = observer(
    ({ expandPlayer, onCollapse, onClose, playPrevItem, playNextItem }) => {
        const { width } = useWindowDimensions();

        return store.player.isCollapsed ? (
            <Collapsed expandPlayer={expandPlayer} onClose={onClose} width={width} />
        ) : (
            <Expanded onCollapse={onCollapse} playPrevItem={playPrevItem} playNextItem={playNextItem} />
        );
    }
);

export default PlayerPopup;
