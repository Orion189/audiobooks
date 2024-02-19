import { ListItem, Icon, useTheme } from '@rneui/themed';
import { RemoteLibItemType } from '@src/@types';
import { REMOTE_LIB_ITEM_TYPE } from '@src/enums';
import store from '@src/store';
import commonStyles from '@src/styles/common';
import { observer } from 'mobx-react-lite';
import { useCallback, FC, memo } from 'react';
import { SafeAreaView, ScrollView, RefreshControl, View, ActivityIndicator } from 'react-native';

type RemoteLibraryProps = {
    openFile: (item: RemoteLibItemType) => void;
    openFolder: (item: RemoteLibItemType) => void;
};

type RefreshingProps = {
    isRefreshing: boolean;
    onRefresh: () => void;
};

type RemoteLibraryItemProps = {
    item: RemoteLibItemType;
};

const RemoteLibraryItem: FC<RemoteLibraryProps & RemoteLibraryItemProps> = memo(({ item, openFile, openFolder }) => {
    const getItemIcon = useCallback((mimeType: string) => {
        switch (mimeType) {
            case REMOTE_LIB_ITEM_TYPE.G_FOLDER:
                return 'folder-outline';
            case REMOTE_LIB_ITEM_TYPE.MPEG:
                return 'file-music-outline';
            default:
                return 'file-outline';
        }
    }, []);
    const onItemPress = useCallback(() => {
        switch (item.mimeType) {
            case REMOTE_LIB_ITEM_TYPE.G_FOLDER:
                openFolder(item);
                break;
            case REMOTE_LIB_ITEM_TYPE.MPEG:
                openFile(item);
                break;
        }
    }, []);

    return (
        <ListItem bottomDivider onPress={onItemPress}>
            {item.mimeType ? <Icon name={getItemIcon(item.mimeType)} type="material-community" color="grey" /> : null}
            <ListItem.Content>
                <ListItem.Title numberOfLines={1} ellipsizeMode="tail">
                    {item.name}
                </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron>
                <Icon name="cloud-download-outline" />
            </ListItem.Chevron>
        </ListItem>
    );
});

const RemoteLibrary: FC<RemoteLibraryProps & RefreshingProps> = observer(
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
                    {store.remote.subItems?.map((item) => (
                        <RemoteLibraryItem key={item.id} openFile={openFile} openFolder={openFolder} item={item} />
                    ))}
                </ScrollView>
            </SafeAreaView>
        );
    }
);

export default RemoteLibrary;
