import { ListItem, Icon, useTheme } from '@rneui/themed';
import { LibItemType } from '@src/@types';
import usePlayer from '@src/components/hooks/usePlayer';
import { LIB_TYPE, LIB_ORDER } from '@src/enums';
import store from '@src/store';
import commonStyles from '@src/styles/common';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, FC, memo } from 'react';
import { SafeAreaView, ScrollView, RefreshControl, View, ActivityIndicator, Animated, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

type LocalLibraryProps = {
    openFolder: (item: LibItemType) => void;
    deleteItem: (item: LibItemType) => void;
};

type RefreshingProps = {
    isRefreshing: boolean;
    onRefresh: () => void;
};

type LocalLibraryItemProps = {
    item: LibItemType;
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
            colors: { textColor }
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
                    color={textColor}
                />
                <ListItem.Content>
                    <ListItem.Title
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{ color: textColor, fontWeight: '400' }}
                    >
                        {item.name}
                    </ListItem.Title>
                </ListItem.Content>
                {item.isDirectory ? <ListItem.Chevron /> : null}
            </ListItem>
        </Swipeable>
    );
});

const LocalLibrary: FC<LocalLibraryProps & RefreshingProps> = observer(
    ({ openFolder, deleteItem, isRefreshing, onRefresh }) => {
        const {
            theme: {
                colors: { textColor, background }
            }
        } = useTheme();
        const getSubItems = useMemo(
            () => () => {
                switch (store.lib.order) {
                    case LIB_ORDER.DEFAULT: {
                        return store[LIB_TYPE.LOCAL].subItems;
                    }
                    case LIB_ORDER.ASC: {
                        return store[LIB_TYPE.LOCAL].subItems
                            ?.slice()
                            .sort((subItem1, subItem2) => subItem1.name.localeCompare(subItem2.name));
                    }
                    case LIB_ORDER.DESC: {
                        return store[LIB_TYPE.LOCAL].subItems
                            ?.slice()
                            .sort((subItem1, subItem2) => subItem1.name.localeCompare(subItem2.name))
                            .reverse();
                    }
                    default:
                        return [];
                }
            },
            [store.lib.order, store[LIB_TYPE.LOCAL].subItems]
        );

        return (
            <SafeAreaView style={[commonStyles.safeAreaView, { backgroundColor: background }]}>
                <View style={commonStyles.activityView}>
                    <ActivityIndicator animating={isRefreshing} size="small" color={textColor} />
                </View>
                <ScrollView
                    refreshControl={
                        <RefreshControl onRefresh={onRefresh} tintColor="transparent" refreshing={isRefreshing} />
                    }
                >
                    {getSubItems()?.map((item) => (
                        <LocalLibraryItem key={item.name} item={item} openFolder={openFolder} deleteItem={deleteItem} />
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
