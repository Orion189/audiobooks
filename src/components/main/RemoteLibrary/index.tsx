import RemoteLibraryView from '@src/components/main/RemoteLibrary/RemoteLibrary';
import { REMOTE_LIB_ITEM_TYPE, LIB_TYPE } from '@src/enums';
import * as remoteService from '@src/services/remote.service';
import store from '@src/store';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';

const RemoteLibrary = observer(() => {
    const getRootId = useCallback(async () => {
        if (store.authInfo.accessToken) {
            const fileData = await remoteService.apiRequest({
                path: '/files/root'
            });
            console.log('fileData:', fileData);
            if (fileData?.id) {
                store.set(LIB_TYPE.REMOTE, {
                    ...store[LIB_TYPE.REMOTE],
                    ...{
                        root: fileData?.id,
                        curItem: {
                            id: fileData?.id,
                            name: fileData?.name,
                            type: REMOTE_LIB_ITEM_TYPE.G_FOLDER,
                            parent: undefined,
                            size: undefined,
                            items: []
                        }
                    }
                });
            }
        }
    }, [store.authInfo.accessToken]);
    const getItems = useCallback(async () => {
        if (store[LIB_TYPE.REMOTE].curItem?.id) {
            console.log('id:', store[LIB_TYPE.REMOTE].curItem?.id);
            const items = await remoteService.apiRequest({
                path: '/files',
                q: `
                    parents in '${store[LIB_TYPE.REMOTE].curItem?.id}' 
                    and mimeType in '${REMOTE_LIB_ITEM_TYPE.G_FOLDER}','${REMOTE_LIB_ITEM_TYPE.MPEG}' 
                    and trashed = false
                `,
                fields: 'files(id,name,mimeType,parents,size)'
            });

            if (items?.files) {
                console.log('items:', items?.files);
            }
        }
    }, [store[LIB_TYPE.REMOTE].curItem]);

    useEffect(() => {
        getRootId();
    }, [store.authInfo.accessToken]);

    useEffect(() => {
        getItems();
    }, [store[LIB_TYPE.REMOTE].curItem]);

    return <RemoteLibraryView />;
});

export default RemoteLibrary;
