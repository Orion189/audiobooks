import { ListItem, Icon, useTheme } from '@rneui/themed';
import { LocalLibItemType } from '@src/@types';
import { LIB_TYPE } from '@src/enums';
import store from '@src/store';
import usePlayer from '@src/components/hooks/usePlayer';
import commonStyles from '@src/styles/common';
import { observer } from 'mobx-react-lite';
import { useCallback, FC, memo } from 'react';
import { SafeAreaView, ScrollView, RefreshControl, View, ActivityIndicator, Animated, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

type LocalLibraryProps = {
    openFolder: (item: LocalLibItemType) => void;
    deleteItem: (item: LocalLibItemType) => void;
};

type RefreshingProps = {
    isRefreshing: boolean;
    onRefresh: () => void;
};

type LocalLibraryItemProps = {
    item: LocalLibItemType;
};

type LocalLibraryItemActionProps = {
    swipeable: Swipeable;
    progress: Animated.AnimatedInterpolation<number>;
    pressHandler: (pointerInside: boolean) => void;
};

const LocalLibraryItemAction = memo(({ swipeable, progress, pressHandler }: LocalLibraryItemActionProps) => {
    const translateX = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
        extrapolate: 'clamp'
    });
    const {
        theme: {
            colors: { white, error }
        }
    } = useTheme();
    const onPress = useCallback(
        (pointerInside: boolean) => {
            swipeable.close();

            pressHandler(pointerInside);
        },
        [pressHandler]
    );

    return (
        <Animated.View style={{ flex: 1, transform: [{ translateX }] }} testID="localLibraryItemAction">
            <RectButton
                onPress={onPress}
                testID="localLibraryItemActionnBtn"
                style={[styles.rightAction, { backgroundColor: error }]}
            >
                <Icon size={25} color={white} type="material-community" name="trash-can-outline" />
            </RectButton>
        </Animated.View>
    );
});

const LocalLibraryItem: FC<LocalLibraryProps & LocalLibraryItemProps> = memo(({ openFolder, deleteItem, item }) => {
    const {
        theme: {
            colors: { greyOutline }
        }
    } = useTheme();
    const { openLocalFile } = usePlayer();
    const onItemPress = useCallback(() => {
        if (item.isDirectory) {
            openFolder(item);
        } else {
            openLocalFile(item);
        }
    }, [openLocalFile, item]);
    const onDeleteItem = useCallback(() => deleteItem(item), [deleteItem, item]);
    const renderRightAction = useCallback(
        (
            progress: Animated.AnimatedInterpolation<number>,
            drag: Animated.AnimatedInterpolation<string | number>,
            swipeable: Swipeable
        ) => <LocalLibraryItemAction progress={progress} swipeable={swipeable} pressHandler={onDeleteItem} />,
        [onDeleteItem]
    );

    return (
        <Swipeable enableTrackpadTwoFingerGesture onSwipeableOpen={onDeleteItem} renderRightActions={renderRightAction}>
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
                {item.isDirectory ? <ListItem.Chevron /> : null}
            </ListItem>
        </Swipeable>
    );
});

const LocalLibrary: FC<LocalLibraryProps & RefreshingProps> = observer(
    ({ openFile, openFolder, deleteItem, isRefreshing, onRefresh }) => {
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
                        <LocalLibraryItem
                            key={item.name}
                            item={item}
                            openFile={openFile}
                            openFolder={openFolder}
                            deleteItem={deleteItem}
                        />
                    ))}
                </ScrollView>
            </SafeAreaView>
        );
    }
);

const styles = StyleSheet.create({
    rightAction: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 15
    }
});

export default LocalLibrary;
