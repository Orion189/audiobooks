import ChangeLibPopupView from '@src/components/main/ChangeLibPopup/ChangeLibPopup';
import { LIB_TYPE } from '@src/enums';
import store from '@src/store';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

const ChangeLibPopup = observer(() => {
    const router = useRouter();
    const changeLibType = useCallback(
        (libType: LIB_TYPE) => {
            switch (libType) {
                case LIB_TYPE.LOCAL: {
                    // TODO: check permissions
                    // if NO - show permissions popup
                    break;
                }
                case LIB_TYPE.REMOTE: {
                    if (!store.authInfo.accessToken) {
                        return router.push('/settings/account');
                    }
                }
            }

            store.set('lib', { ...store.lib, curLib: libType });

            onClose();
        },
        [store.authInfo.accessToken]
    );
    const onClose = useCallback(() => {
        store.set('lib', { ...store.lib, isChangeLibPopupVisible: false });
    }, [store.lib.isChangeLibPopupVisible]);

    return <ChangeLibPopupView changeLibType={changeLibType} onClose={onClose} />;
});

export default ChangeLibPopup;
