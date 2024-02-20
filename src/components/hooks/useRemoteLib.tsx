import { REMOTE_LIB_ITEM_TYPE, LIB_TYPE } from '@src/enums';
import * as remoteService from '@src/services/remote.service';
import store from '@src/store';
import { useCallback } from 'react';

type ConfigType = {
    onStart?: () => void;
    onEnd?: () => void;
};

const useRemoteLib = () => {
    const getItem = useCallback(
        async (id: string, config: ConfigType = {}) => {
            if (store.authInfo.accessToken) {
                const { onStart, onEnd } = config;
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
            }
        },
        [store.authInfo.accessToken]
    );
    const getSubItems = useCallback(
        async (config: ConfigType = {}) => {
            if (store[LIB_TYPE.REMOTE].curItem?.id) {
                const { onStart, onEnd } = config;
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
            }
        },
        [store[LIB_TYPE.REMOTE].curItem]
    );
    const downloadFile = useCallback(
        async (id: string, config: ConfigType = {}) => {
            if (store.authInfo.accessToken) {
                const { onStart, onEnd } = config;
                const fileData = await remoteService.apiRequest({
                    path: `/files/${id}`,
                    alt: 'media',
                    onStart,
                    onEnd
                });

                return fileData;
            }
        },
        [store.authInfo.accessToken]
    );

    return {
        getItem,
        getSubItems,
        downloadFile
    };
};

export default useRemoteLib;
