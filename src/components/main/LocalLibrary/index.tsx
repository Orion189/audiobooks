import { LibItemType } from '@src/@types';
import useLocalLib from '@src/components/hooks/useLocalLib';
import LocalLibraryView from '@src/components/main/LocalLibrary/LocalLibrary';
import Loading from '@src/components/shared/Loading';
import { APP_DIR } from '@src/constants';
import { LIB_TYPE } from '@src/enums';
import store from '@src/store';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';

const LocalLibrary = observer(() => {
    const { getItem, getSubItems, deleteItem: deleteLocalItem } = useLocalLib();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const onStart = useCallback(() => store.set('app', { ...store.app, isLoadingVisible: true }), []);
    const onEnd = useCallback(() => store.set('app', { ...store.app, isLoadingVisible: false }), []);
    const onStartAlt = useCallback(
        () => store.set('app', { ...store.app, progressbar: { isProgressBarVisible: true } }),
        []
    );
    const onEndAlt = useCallback(
        () => store.set('app', { ...store.app, progressbar: { isProgressBarVisible: false } }),
        []
    );
    const onRefreshStart = useCallback(() => setIsRefreshing(true), []);
    const onRefreshEnd = useCallback(() => setIsRefreshing(false), []);
    const onRefresh = useCallback(() => {
        getSubItems({
            onStart: onRefreshStart,
            onEnd: onRefreshEnd
        });
    }, [getSubItems]);
    const openFolder = useCallback(
        (item: LibItemType) => {
            getItem(item.uri, {
                onStart,
                onEnd
            });
        },
        [getItem, onStart, onEnd]
    );
    const deleteItem = useCallback(
        async (item: LibItemType) => {
            await deleteLocalItem(item.uri, {
                onStart: onStartAlt,
                onEnd: onEndAlt
            });

            const downloadedItemNames = store[LIB_TYPE.LOCAL].downloadedItemNames?.filter(
                (itemName) => itemName !== item.name
            );

            if (downloadedItemNames) {
                store.set(LIB_TYPE.LOCAL, {
                    ...store[LIB_TYPE.LOCAL],
                    downloadedItemNames
                });
            }

            getSubItems({
                onStart: onStartAlt,
                onEnd: onEndAlt
            });
        },
        [deleteLocalItem, onStartAlt, onEndAlt]
    );

    useEffect(() => {
        if (APP_DIR) {
            getItem(APP_DIR, {
                onStart,
                onEnd
            });
        }
    }, [getItem, onStart, onEnd, deleteItem, APP_DIR]);

    useEffect(() => {
        getSubItems({
            onStart,
            onEnd
        });
    }, [getSubItems, onStart, onEnd, deleteItem]);

    return store.app.isLoadingVisible ? (
        <Loading />
    ) : (
        <LocalLibraryView
            onRefresh={onRefresh}
            openFolder={openFolder}
            deleteItem={deleteItem}
            isRefreshing={isRefreshing}
        />
    );
});

export default LocalLibrary;
