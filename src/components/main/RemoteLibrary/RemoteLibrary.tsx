import { ListItem, Icon, useTheme, Button } from '@rneui/themed';
import { RemoteLibItemType } from '@src/@types';
import usePlayer from '@src/components/hooks/usePlayer';
import useRemoteLib from '@src/components/hooks/useRemoteLib';
import { REMOTE_LIB_ITEM_TYPE, LIB_TYPE } from '@src/enums';
import store from '@src/store';
import commonStyles from '@src/styles/common';
import { observer } from 'mobx-react-lite';
import { useCallback, useState, FC, memo } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, RefreshControl, View, ActivityIndicator } from 'react-native';

type RemoteLibraryProps = {
    openFolder: (item: RemoteLibItemType) => void;
};

type RefreshingProps = {
    isRefreshing: boolean;
    onRefresh: () => void;
};

type RemoteLibraryItemProps = {
    item: RemoteLibItemType;
};

type DownloadItemBtnProps = {
    name: string;
    isDownloading: boolean;
    onPressCb: () => void;
};

const DownloadItemBtn: FC<DownloadItemBtnProps> = observer(({ name, isDownloading, onPressCb }) => {
    const isItemDownloaded = store[LIB_TYPE.LOCAL].downloadedItemNames.includes(name);

    return isItemDownloaded ? null : (
        <Button type="clear" buttonStyle={styles.downloadBtn} onPress={onPressCb}>
            {isDownloading ? <ActivityIndicator /> : <Icon name="cloud-download-outline" type="material-community" />}
        </Button>
    );
});

const RemoteLibraryItem: FC<RemoteLibraryProps & RemoteLibraryItemProps> = memo(({ openFolder, item }) => {
    const {
        theme: {
            colors: { greyOutline }
        }
    } = useTheme();
    const { openRemoteFile } = usePlayer();
    const { download, pause } = useRemoteLib();
    const [isDownloading, setIsDownloading] = useState(false);
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
                !isDownloading && openRemoteFile(item);
                break;
        }
    }, [openFolder, openRemoteFile, isDownloading, item.mimeType]);
    const onPressCb = useCallback(async () => {
        if (isDownloading) {
            setIsDownloading(false);
            pause(item);
        } else {
            setIsDownloading(true);
            download(item).then(() => setIsDownloading(false));
        }
    }, [download, setIsDownloading, item, isDownloading]);

    return (
        <ListItem bottomDivider onPress={onItemPress}>
            {item.mimeType ? (
                <Icon name={getItemIcon(item.mimeType)} type="material-community" color={greyOutline} />
            ) : null}
            <ListItem.Content>
                <ListItem.Title numberOfLines={1} ellipsizeMode="tail">
                    {item.name}
                </ListItem.Title>
            </ListItem.Content>
            {item.mimeType === REMOTE_LIB_ITEM_TYPE.G_FOLDER ? (
                <ListItem.Chevron />
            ) : (
                <DownloadItemBtn isDownloading={isDownloading} onPressCb={onPressCb} name={item.name} />
            )}
        </ListItem>
    );
});

const RemoteLibrary: FC<RemoteLibraryProps & RefreshingProps> = observer(({ openFolder, isRefreshing, onRefresh }) => {
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
                    <RemoteLibraryItem key={item.id} item={item} openFolder={openFolder} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
});

const styles = StyleSheet.create({
    downloadBtn: {
        padding: 0
    }
});

export default RemoteLibrary;
