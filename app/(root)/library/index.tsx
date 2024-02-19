import { useTheme, Text, Icon, Button, Header as HeaderRNE } from '@rneui/themed';
import useRemoteLib from '@src/components/hooks/useRemoteLib';
import ChangeLibPopup from '@src/components/main/ChangeLibPopup';
import Library from '@src/components/main/Library';
import Loading from '@src/components/shared/Loading';
import ProgressBar from '@src/components/shared/ProgressBar';
import { LIB_TYPE, LIB_ICON, LIB_ORDER, ORDER_ICON } from '@src/enums';
import store from '@src/store';
import { Stack } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Platform } from 'react-native';

const Header = observer(() => {
    const {
        theme: {
            colors: { primary, white }
        }
    } = useTheme();
    const { t } = useTranslation();
    const { getItem } = useRemoteLib();
    const parentFolderId = store[LIB_TYPE.REMOTE].curItem?.parents?.toString();
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
            // TODO: check permissions
            return LIB_ICON.HOME;
        } else {
            return LIB_ICON.LOCK;
        }
    }, [store.authInfo.accessToken, store.lib.curLib]); // TODO: add permissions depedency
    const onStart = useCallback(() => store.set('app', { ...store.app, isLoadingVisible: true }), []);
    const onEnd = useCallback(() => store.set('app', { ...store.app, isLoadingVisible: false }), []);
    const openBackBtnPress = useCallback(() => {
        if (parentFolderId) {
            getItem(parentFolderId, {
                onStart,
                onEnd
            });
        }
    }, [parentFolderId, getItem]);

    return (
        <>
            <HeaderRNE
                backgroundColor={primary}
                leftComponent={
                    parentFolderId ? (
                        <Button type="clear" onPress={openBackBtnPress}>
                            <Icon name={Platform.OS === 'android' ? 'arrow-back' : 'arrow-back-ios'} color={white} />
                        </Button>
                    ) : undefined
                }
                centerComponent={<Text h3>{t('app.library.index.title')}</Text>}
                rightComponent={
                    <View style={styles.rightComponentCont}>
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
        </>
    );
});

const LibraryPage = observer(() => {
    const header = useCallback(() => <Header />, []);

    return (
        <>
            <Stack.Screen
                options={{
                    header
                }}
            />
            <Library />
            {store.lib.isChangeLibPopupVisible ? <ChangeLibPopup /> : null}
        </>
    );
});

const styles = StyleSheet.create({
    rightComponentCont: {
        display: 'flex',
        flexDirection: 'row'
    }
});

export default LibraryPage;
