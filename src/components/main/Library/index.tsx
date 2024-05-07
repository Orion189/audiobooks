import { Text, useTheme } from '@rneui/themed';
import LocalLibrary from '@src/components/main/LocalLibrary';
import RemoteLibrary from '@src/components/main/RemoteLibrary';
import { LIB_TYPE } from '@src/enums';
import store from '@src/store';
import commonStyles from '@src/styles/common';
import { observer } from 'mobx-react-lite';
import { useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

const ChooseLib = memo(() => {
    const {
        theme: {
            colors: { textColor, background }
        }
    } = useTheme();
    const { t } = useTranslation();

    return (
        <SafeAreaView style={[commonStyles.safeAreaView, { backgroundColor: background }]}>
            <ScrollView contentContainerStyle={styles.mainCont}>
                <Text h4 h4Style={{ color: textColor, fontSize: 14 }}>
                    {t('src.components.main.Library.chooseLibMsg')}
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
});

const Library = observer(() => {
    const getLibComponent = useCallback(() => {
        switch (store.lib.curLib) {
            case LIB_TYPE.LOCAL:
                return <LocalLibrary />;
            case LIB_TYPE.REMOTE:
                return <RemoteLibrary />;
            case LIB_TYPE.NONE:
                return <ChooseLib />;
        }
    }, [store.lib.curLib]);

    return getLibComponent();
});

const styles = StyleSheet.create({
    mainCont: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default Library;
