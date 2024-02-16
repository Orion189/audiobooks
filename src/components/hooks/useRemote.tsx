import { REMOTE_LIB_ITEM_TYPE, LIB_TYPE } from '@src/enums';
import * as remoteService from '@src/services/remote.service';
import store from '@src/store';
import { useCallback } from 'react';

const useRemote = () => {
    const onStart = useCallback(() => store.set('app', { ...store.app, isProgressBarVisible: true }), []);
    const onEnd = useCallback(() => store.set('app', { ...store.app, isProgressBarVisible: false }), []);
    const getItem = useCallback(async (id: string) => {
        const fileData = await remoteService.apiRequest({
            path: `/files/${id}`,
            fields: 'id,name,mimeType,parents,size',
            onStart,
            onEnd
        });

        if (fileData?.id) {
            store.set(LIB_TYPE.REMOTE, {
                ...store[LIB_TYPE.REMOTE],
                curItem: fileData,
                subItems: []
            });
        }
    }, []);
    const getSubItems = useCallback(async () => {
        const filesData = await remoteService.apiRequest({
            path: '/files',
            orderBy: 'folder,name',
            q: `
                parents in '${store[LIB_TYPE.REMOTE].curItem?.id}' 
                and mimeType in '${REMOTE_LIB_ITEM_TYPE.G_FOLDER}','${REMOTE_LIB_ITEM_TYPE.MPEG}' 
                and trashed = false
            `,
            fields: 'files(id,name,mimeType,parents,size)',
            onStart,
            onEnd
        });

        if (filesData?.files.length) {
            store.set(LIB_TYPE.REMOTE, {
                ...store[LIB_TYPE.REMOTE],
                subItems: filesData?.files
            });
        }
    }, [store[LIB_TYPE.REMOTE].curItem]);

    return {
        getItem,
        getSubItems
    };
};

export default useRemote;
