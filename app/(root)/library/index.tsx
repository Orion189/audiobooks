import { useTheme, Text, Icon, Button, Header as HeaderRNE } from '@rneui/themed';
import useLocalLib from '@src/components/hooks/useLocalLib';
import useRemoteLib from '@src/components/hooks/useRemoteLib';
import ChangeLibPopup from '@src/components/main/ChangeLibPopup';
import Library from '@src/components/main/Library';
import ProgressBar from '@src/components/shared/ProgressBar';
import { LIB_TYPE, LIB_ICON, LIB_ORDER, ORDER_ICON } from '@src/enums';
import store from '@src/store';
import commonStyles from '@src/styles/common';
import { documentDirectory } from 'expo-file-system';
import { Stack } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

const BackBtn = observer(() => {
    const {
        theme: {
            colors: { white }
        }
    } = useTheme();
    const { getItem: getLocalItem } = useLocalLib();
    const { getItem: getRemoteItem } = useRemoteLib();
    const onStart = useCallback(() => store.set('app', { ...store.app, isLoadingVisible: true }), []);
    const onEnd = useCallback(() => store.set('app', { ...store.app, isLoadingVisible: false }), []);
    const isBackBtnShown = useCallback(() => {
        switch (store.lib.curLib) {
            case LIB_TYPE.LOCAL:
                return store[LIB_TYPE.LOCAL].curItem?.uri !== documentDirectory;
            case LIB_TYPE.REMOTE:
                return store[LIB_TYPE.REMOTE].curItem?.parents?.length;
        }
    }, [documentDirectory, store.lib.curLib]);
    const onBackBtnPress = useCallback(() => {
        if (!isBackBtnShown()) {
            return;
        }

        switch (store.lib.curLib) {
            case LIB_TYPE.LOCAL: {
                if (documentDirectory) {
                    return getLocalItem(documentDirectory, {
                        onStart,
                        onEnd
                    });
                }

                break;
            }
            case LIB_TYPE.REMOTE: {
                const parentFolder = store[LIB_TYPE.REMOTE].curItem?.parents?.toString();

                if (parentFolder) {
                    return getRemoteItem(parentFolder, {
                        onStart,
                        onEnd
                    });
                }

                break;
            }
        }
    }, [isBackBtnShown, getLocalItem, getRemoteItem, onStart, onEnd, store.lib.curLib]);
    const getIconName = useCallback(() => {
        switch (store.lib.curLib) {
            case LIB_TYPE.LOCAL:
                return LIB_ICON.BACK_TO_HOME;
            case LIB_TYPE.REMOTE:
                return LIB_ICON.BACK;
            default:
                return '';
        }
    }, [store.lib.curLib]);

    return isBackBtnShown() ? (
        <Button type="clear" onPress={onBackBtnPress}>
            <Icon name={getIconName()} color={white} type="material-community" />
        </Button>
    ) : undefined;
});

const Header = observer(() => {
    const {
        theme: {
            colors: { headerBgColor, white, background }
        }
    } = useTheme();
    const { t } = useTranslation();
    const openChangeLibPopup = useCallback(
        () => store.set('lib', { ...store.lib, isChangeLibPopupVisible: true }),
        [store.lib.isChangeLibPopupVisible]
    );
    const changeOrder = useCallback(() => {
        store.set('lib', {
            ...store.lib,
            order: store.lib.order === LIB_ORDER.ASC ? LIB_ORDER.DESC : LIB_ORDER.ASC
        });
    }, [store.lib.order]);
    const getOrderIcon = useCallback(() => {
        switch (store.lib.order) {
            case LIB_ORDER.DEFAULT:
                return ORDER_ICON.DEFAULT;
            case LIB_ORDER.ASC:
                return ORDER_ICON.ASC;
            case LIB_ORDER.DESC:
                return ORDER_ICON.DESC;
            default:
                return ORDER_ICON.DEFAULT;
        }
    }, [store.lib.order]);
    const getLibIcon = useCallback(() => {
        if (store.lib.curLib === LIB_TYPE.REMOTE && store.authInfo.accessToken) {
            return LIB_ICON.GDRIVE;
        } else if (store.lib.curLib === LIB_TYPE.LOCAL && true) {
            return LIB_ICON.HOME;
        } else {
            return LIB_ICON.LOCK;
        }
    }, [store.authInfo.accessToken, store.lib.curLib]);

    return (
        <View style={{ backgroundColor: background }}>
            <HeaderRNE
                containerStyle={commonStyles.header}
                backgroundColor={headerBgColor}
                leftComponent={<BackBtn />}
                centerContainerStyle={commonStyles.centerComponentCont}
                centerComponent={
                    <Text h4 h4Style={{ color: white }}>
                        {t('app.library.index.title')}
                    </Text>
                }
                rightComponent={
                    <View style={commonStyles.rightComponentCont}>
                        {store.lib.curLib === LIB_TYPE.NONE ? null : (
                            <Button type="clear" onPress={changeOrder}>
                                <Icon size={25} color={white} type="material-community" name={getOrderIcon()} />
                            </Button>
                        )}
                        <Button type="clear" onPress={openChangeLibPopup}>
                            <Icon size={25} color={white} type="material-community" name={getLibIcon()} />
                        </Button>
                    </View>
                }
            />
            <ProgressBar />
        </View>
    );
});

const LibraryPage = memo(() => {
    const header = useCallback(() => <Header />, []);

    return (
        <>
            <Stack.Screen
                options={{
                    header
                }}
            />
            <Library />
            <ChangeLibPopup />
        </>
    );
});

export default LibraryPage;
