import { LocalLibItemType } from '@src/@types';
import useLocalLib from '@src/components/hooks/useLocalLib';
import LocalLibraryView from '@src/components/main/LocalLibrary/LocalLibrary';
import Loading from '@src/components/shared/Loading';
import store from '@src/store';
import { documentDirectory } from 'expo-file-system';
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
        (item: LocalLibItemType) => {
            getItem(item.uri, {
                onStart,
                onEnd
            });
        },
        [getItem, onStart, onEnd]
    );
    const openFile = useCallback((item: LocalLibItemType) => {
        console.log(item);
    }, []);
    const deleteItem = useCallback(
        async (item: LocalLibItemType) => {
            await deleteLocalItem(item.uri, {
                onStart: onStartAlt,
                onEnd: onEndAlt
            });

            getSubItems({
                onStart: onStartAlt,
                onEnd: onEndAlt
            });
        },
        [deleteLocalItem, onStartAlt, onEndAlt]
    );

    useEffect(() => {
        if (documentDirectory) {
            getItem(documentDirectory, {
                onStart,
                onEnd
            });
        }
    }, [getItem, onStart, onEnd, documentDirectory]);

    useEffect(() => {
        getSubItems({
            onStart,
            onEnd
        });
    }, [getSubItems, onStart, onEnd]);

    return store.app.isLoadingVisible ? (
        <Loading />
    ) : (
        <LocalLibraryView
            openFile={openFile}
            onRefresh={onRefresh}
            openFolder={openFolder}
            deleteItem={deleteItem}
            isRefreshing={isRefreshing}
        />
    );
});

export default LocalLibrary;
