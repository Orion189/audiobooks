import ChangeLibPopupView from '@src/components/main/ChangeLibPopup/ChangeLibPopup';
import { LIB_TYPE } from '@src/enums';
import store from '@src/store';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

const ChangeLibPopup = observer(() => {
    const router = useRouter();
    const onClose = useCallback(() => {
        store.set('lib', { ...store.lib, isChangeLibPopupVisible: false });
    }, [store.lib.isChangeLibPopupVisible]);
    const changeLibType = useCallback(
        (libType: LIB_TYPE) => {
            switch (libType) {
                case LIB_TYPE.LOCAL: {
                    onClose();

                    store.set('lib', { ...store.lib, curLib: libType });

                    break;
                }
                case LIB_TYPE.REMOTE: {
                    onClose();

                    if (store.authInfo.accessToken) {
                        store.set('lib', { ...store.lib, curLib: libType });
                    } else {
                        router.push('/settings/account');
                    }
                }
            }
        },
        [store.authInfo.accessToken, onClose]
    );

    return <ChangeLibPopupView changeLibType={changeLibType} onClose={onClose} />;
});

export default ChangeLibPopup;
