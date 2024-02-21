import { RemoteLibItemType } from '@src/@types';
import useDownload from '@src/components/hooks/useDownload';
import useRemoteLib from '@src/components/hooks/useRemoteLib';
import RemoteLibraryView from '@src/components/main/RemoteLibrary/RemoteLibrary';
import Loading from '@src/components/shared/Loading';
import { LIB_TYPE } from '@src/enums';
import store from '@src/store';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';

const RemoteLibrary = observer(() => {
    const { getItem, getSubItems } = useRemoteLib();
    const { download, pause } = useDownload();
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
    const openFolder = useCallback(
        (item: RemoteLibItemType) => {
            store.set(LIB_TYPE.REMOTE, {
                ...store[LIB_TYPE.REMOTE],
                curItem: item,
                subItems: []
            });
        },
        [getSubItems]
    );
    const openFile = useCallback((item: RemoteLibItemType) => {
        console.log(item);
    }, []);
    const donwloadFile = useCallback(
        async (item: RemoteLibItemType) => {
            console.log(item);

            const fileURI = await download(item);

            console.log('file URI:', fileURI);
        },
        [download]
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
            donwloadFile={donwloadFile}
            isRefreshing={isRefreshing}
        />
    );
});

export default RemoteLibrary;
