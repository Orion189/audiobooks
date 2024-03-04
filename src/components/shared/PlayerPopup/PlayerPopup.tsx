import Collapsed from '@src/components/shared/PlayerPopup/Collapsed';
import Expanded from '@src/components/shared/PlayerPopup/Expanded';
import store from '@src/store';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';

type PlayerPopupProps = {
    expandPlayer: () => void;
    onCollapse: () => void;
    onClose: () => void;
};

const PlayerPopup: FC<PlayerPopupProps> = observer(({ expandPlayer, onCollapse, onClose }) =>
    store.player.isCollapsed ? (
        <Collapsed expandPlayer={expandPlayer} onClose={onClose} />
    ) : (
        <Expanded onCollapse={onCollapse} />
    )
);

export default PlayerPopup;
