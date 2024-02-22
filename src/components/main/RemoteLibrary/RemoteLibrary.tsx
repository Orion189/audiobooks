import { ListItem, Icon, useTheme, Button } from '@rneui/themed';
import { RemoteLibItemType } from '@src/@types';
import useDownload from '@src/components/hooks/useDownload';
import { REMOTE_LIB_ITEM_TYPE, LIB_TYPE } from '@src/enums';
import store from '@src/store';
import commonStyles from '@src/styles/common';
import { observer } from 'mobx-react-lite';
import { useCallback, useState, FC, memo } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, RefreshControl, View, ActivityIndicator } from 'react-native';

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

const RemoteLibraryItem: FC<RemoteLibraryProps & RemoteLibraryItemProps> = memo(({ openFile, openFolder, item }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const { download, pause } = useDownload();
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
    const onPressCb = useCallback(() => {
        if (isDownloading) {
            download(item);
        } else {
            pause(item);
        }

        setIsDownloading(!isDownloading);
    }, [download, pause, setIsDownloading, item, isDownloading]);

    return (
        <ListItem bottomDivider onPress={onItemPress}>
            {item.mimeType ? <Icon name={getItemIcon(item.mimeType)} type="material-community" color="grey" /> : null}
            <ListItem.Content>
                <ListItem.Title numberOfLines={1} ellipsizeMode="tail">
                    {item.name}
                </ListItem.Title>
            </ListItem.Content>
            {item.mimeType === REMOTE_LIB_ITEM_TYPE.G_FOLDER ? (
                <ListItem.Chevron />
            ) : (
                <Button type="clear" buttonStyle={styles.downloadBtn} onPress={onPressCb}>
                    <Icon name={isDownloading ? 'pause' : 'cloud-download-outline'} type="material-community" />
                </Button>
            )}
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
                    {store[LIB_TYPE.REMOTE].subItems?.map((item) => (
                        <RemoteLibraryItem key={item.id} item={item} openFile={openFile} openFolder={openFolder} />
                    ))}
                </ScrollView>
            </SafeAreaView>
        );
    }
);

const styles = StyleSheet.create({
    downloadBtn: {
        padding: 0
    }
});

export default RemoteLibrary;
