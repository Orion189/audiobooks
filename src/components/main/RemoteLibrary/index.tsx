import { RemoteLibItemType } from '@src/@types';
import usePlayer from '@src/components/hooks/usePlayer';
import useRemoteLib from '@src/components/hooks/useRemoteLib';
import RemoteLibraryView from '@src/components/main/RemoteLibrary/RemoteLibrary';
import Loading from '@src/components/shared/Loading';
import { LIB_TYPE } from '@src/enums';
import store from '@src/store';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';

const RemoteLibrary = observer(() => {
    const { playRemoteFile } = usePlayer();
    const { getItem, getSubItems } = useRemoteLib();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const onStart = useCallback(() => store.set('app', { ...store.app, isLoadingVisible: true }), []);
    const onEnd = useCallback(() => store.set('app', { ...store.app, isLoadingVisible: false }), []);
    const onRefreshStart = useCallback(() => setIsRefreshing(true), []);
    const onRefreshEnd = useCallback(() => setIsRefreshing(false), []);
    const onRefresh = useCallback(() => {
        getSubItems({
            onStart: onRefreshStart,
            onEnd: onRefreshEnd
        });
    }, [getSubItems]);
    const openFolder = useCallback((item: RemoteLibItemType) => {
        store.set(LIB_TYPE.REMOTE, {
            ...store[LIB_TYPE.REMOTE],
            curItem: item,
            subItems: []
        });
    }, []);
    const openFile = useCallback(
        (item: RemoteLibItemType) => {
            store.set('player', {
                ...store.player,
                isVisible: true,
                item: {
                    ...store.player.item,
                    isRemote: true,
                    id: item.id,
                    name: item.name
                }
            });

            playRemoteFile(item);
        },
        [playRemoteFile]
    );

    useEffect(() => {
        getItem('root', {
            onStart,
            onEnd
        });
    }, [getItem, onStart, onEnd]);

    useEffect(() => {
        getSubItems({
            onStart,
            onEnd
        });
    }, [getSubItems, onStart, onEnd]);

    return store.app.isLoadingVisible ? (
        <Loading />
    ) : (
        <RemoteLibraryView
            openFile={openFile}
            onRefresh={onRefresh}
            openFolder={openFolder}
            isRefreshing={isRefreshing}
        />
    );
});

export default RemoteLibrary;
