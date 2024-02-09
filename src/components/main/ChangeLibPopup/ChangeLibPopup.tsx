import { useTheme, ListItem, Icon, Dialog } from '@rneui/themed';
import { LIB_TYPE, LIB_ICON } from '@src/enums';
import commonStyles from '@src/styles/common';
import { useCallback, FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, View, StyleSheet } from 'react-native';

type ChangeLibPopupProps = {
    changeLibType: (libType: LIB_TYPE) => void;
    onClose: () => void;
};

type LocaleItemProps = {
    libType: LIB_TYPE;
    changeLibType: (libType: LIB_TYPE) => void;
};

const ChangeLibPopupItem: FC<LocaleItemProps> = memo(({ libType, changeLibType }) => {
    const { t } = useTranslation();
    const {
        theme: {
            colors: { background, disabled, black }
        }
    } = useTheme();
    const getIcon = useCallback(() => {
        switch (libType) {
            case LIB_TYPE.LOCAL:
                return LIB_ICON.HOME;
            case LIB_TYPE.REMOTE:
                return LIB_ICON.GDRIVE;
            case LIB_TYPE.NONE:
                return LIB_ICON.LOCK;
        }
    }, [libType]);
    const changeLibTypeCb = useCallback(() => changeLibType(libType), [libType]);

    return (
        <ListItem bottomDivider onPress={changeLibTypeCb}>
            <Icon name={getIcon()} type="material-community" color={black} size={30} />
            <ListItem.Content>
                <ListItem.Title>{t(`src.components.main.ChangeLibPopup.libTypes.${libType}`)}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
    );
});

const ChangeLibPopup: FC<ChangeLibPopupProps> = memo(({ changeLibType, onClose }) => {
    const { t } = useTranslation();

    return (
        <SafeAreaView style={commonStyles.safeAreaView}>
            <ScrollView>
                <Dialog onBackdropPress={onClose} overlayStyle={styles.overlay}>
                    <Dialog.Title title={t('src.components.main.ChangeLibPopup.title')} />
                    <View style={styles.dialogView}>
                        {[LIB_TYPE.LOCAL, LIB_TYPE.REMOTE].map((libType) => (
                            <ChangeLibPopupItem key={libType} libType={libType} changeLibType={changeLibType} />
                        ))}
                    </View>
                </Dialog>
            </ScrollView>
        </SafeAreaView>
    );
});

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        backgroundColor: '#fff',
        borderRadius: 15,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        width: '100%'
    },
    dialogView: {
        width: '100%',
        paddingBottom: 40
    }
});

export default ChangeLibPopup;
