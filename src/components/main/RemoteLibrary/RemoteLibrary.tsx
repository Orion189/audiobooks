import { ListItem, Icon, useTheme, Button } from '@rneui/themed';
import { LibItemType } from '@src/@types';
import usePlayer from '@src/components/hooks/usePlayer';
import useRemoteLib from '@src/components/hooks/useRemoteLib';
import { LIB_TYPE } from '@src/enums';
import store from '@src/store';
import commonStyles from '@src/styles/common';
import { observer } from 'mobx-react-lite';
import { useCallback, useState, FC, memo } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, RefreshControl, View, ActivityIndicator } from 'react-native';

type RemoteLibraryProps = {
    openFolder: (item: LibItemType) => void;
};

type RefreshingProps = {
    isRefreshing: boolean;
    onRefresh: () => void;
};

type RemoteLibraryItemProps = {
    item: LibItemType;
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
    const onItemPress = useCallback(() => {
        if (item.isDirectory) {
            openFolder(item);
        } else {
            !isDownloading && openRemoteFile(item);
        }
    }, [openFolder, openRemoteFile, isDownloading, item.isDirectory]);
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
            <Icon
                name={item.isDirectory ? 'folder-outline' : 'file-music-outline'}
                type="material-community"
                color={greyOutline}
            />
            <ListItem.Content>
                <ListItem.Title numberOfLines={1} ellipsizeMode="tail">
                    {item.name}
                </ListItem.Title>
            </ListItem.Content>
            {item.isDirectory ? (
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
