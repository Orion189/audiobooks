import { RemoteLibItemType } from '@src/@types';
import useRemote from '@src/components/hooks/useRemote';
import RemoteLibraryView from '@src/components/main/RemoteLibrary/RemoteLibrary';
import { LIB_TYPE } from '@src/enums';
import store from '@src/store';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';

const RemoteLibrary = observer(() => {
    const { getItem, getSubItems } = useRemote();
    const openFolder = useCallback(
        (item: RemoteLibItemType) => {
            store.set(LIB_TYPE.REMOTE, {
                ...store[LIB_TYPE.REMOTE],
                curItem: item,
                subItems: []
            });

            getSubItems();
        },
        [getSubItems]
    );
    const openFile = useCallback((item: RemoteLibItemType) => {
        console.log(item);
    }, []);

    useEffect(() => {
        if (store.authInfo.accessToken) {
            getItem('root');
        }
    }, [store.authInfo.accessToken]);

    useEffect(() => {
        if (store[LIB_TYPE.REMOTE].curItem?.id) {
            getSubItems();
        }
    }, [store[LIB_TYPE.REMOTE].curItem]);

    return <RemoteLibraryView openFolder={openFolder} openFile={openFile} />;
});

export default RemoteLibrary;
