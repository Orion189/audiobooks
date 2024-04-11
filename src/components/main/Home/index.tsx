import { useTheme, ListItem } from '@rneui/themed';
import { LibItemType } from '@src/@types';
import usePlayer from '@src/components/hooks/usePlayer';
import store from '@src/store';
import commonStyles from '@src/styles/common';
import { observer } from 'mobx-react-lite';
import { useCallback, memo, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

type ItemProps = {
    item: LibItemType;
};

const Item: FC<ItemProps> = memo(({ item }) => {
    const { openRemoteFile, openLocalFile } = usePlayer();
    const onItemPress = useCallback(() => {
        if (item.isRemote) {
            openRemoteFile(item);
        } else {
            openLocalFile(item);
        }
    }, [openRemoteFile, openLocalFile, item]);

    return (
        <ListItem bottomDivider onPress={onItemPress}>
            <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
    );
});

const Home = observer(() => {
    const { t } = useTranslation();
    const {
        theme: {
            colors: { grey5 }
        }
    } = useTheme();

    return (
        <SafeAreaView style={commonStyles.safeAreaView}>
            <ScrollView>
                <View>
                    <ListItem topDivider bottomDivider containerStyle={{ backgroundColor: grey5 }}>
                        <ListItem.Content style={styles.itemContent}>
                            <ListItem.Title>{t('src.components.main.Home.sections.recently.title')}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                    {store.history?.map((item) => <Item key={item.uri} item={item} />)}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
});

const styles = StyleSheet.create({
    itemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

export default Home;
