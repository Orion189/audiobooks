import { ListItem, Icon, useTheme } from '@rneui/themed';
import { LocalLibItemType } from '@src/@types';
import { LIB_TYPE } from '@src/enums';
import store from '@src/store';
import commonStyles from '@src/styles/common';
import { observer } from 'mobx-react-lite';
import { useCallback, FC, memo } from 'react';
import { SafeAreaView, ScrollView, RefreshControl, View, ActivityIndicator } from 'react-native';

type LocalLibraryProps = {
    openFile: (item: LocalLibItemType) => void;
    openFolder: (item: LocalLibItemType) => void;
};

type RefreshingProps = {
    isRefreshing: boolean;
    onRefresh: () => void;
};

type LocalLibraryItemProps = {
    item: LocalLibItemType;
};

const LocalLibraryItem: FC<LocalLibraryProps & LocalLibraryItemProps> = memo(({ openFile, openFolder, item }) => {
    const onItemPress = useCallback(() => {
        if (item.isDirectory) {
            openFolder(item);
        } else {
            openFile(item);
        }
    }, [openFolder, openFile]);

    return (
        <ListItem bottomDivider onPress={onItemPress}>
            <Icon
                name={item.isDirectory ? 'folder-outline' : 'file-music-outline'}
                type="material-community"
                color="grey"
            />
            <ListItem.Content>
                <ListItem.Title numberOfLines={1} ellipsizeMode="tail">
                    {item.name}
                </ListItem.Title>
            </ListItem.Content>
            {item.isDirectory ? <ListItem.Chevron /> : null}
        </ListItem>
    );
});

const LocalLibrary: FC<LocalLibraryProps & RefreshingProps> = observer(
    ({ openFile, openFolder, isRefreshing, onRefresh }) => {
        const {
            theme: {
                colors: { primary }
            }
        } = useTheme();

        return (
            <SafeAreaView style={commonStyles.safeAreaView}>
                <View style={commonStyles.activityView}>
                    <ActivityIndicator animating={isRefreshing} size="small" color={primary} />
                </View>
                <ScrollView
                    refreshControl={
                        <RefreshControl onRefresh={onRefresh} tintColor="transparent" refreshing={isRefreshing} />
                    }
                >
                    {store[LIB_TYPE.LOCAL].subItems?.map((item) => (
                        <LocalLibraryItem key={item.name} item={item} openFile={openFile} openFolder={openFolder} />
                    ))}
                </ScrollView>
            </SafeAreaView>
        );
    }
);

export default LocalLibrary;
