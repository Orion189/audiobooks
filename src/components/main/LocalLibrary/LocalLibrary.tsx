import { ListItem, Icon, Text, useTheme } from '@rneui/themed';
import { LibItemType } from '@src/@types';
import usePlayer from '@src/components/hooks/usePlayer';
import { LIB_TYPE, LIB_ORDER } from '@src/enums';
import store from '@src/store';
import commonStyles from '@src/styles/common';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, FC, memo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, RefreshControl, View, ActivityIndicator, Animated, StyleSheet } from 'react-native';
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
};

const LocalLibraryItemAction = memo(({ swipeable, progress }: LocalLibraryItemActionProps) => {
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

    return (
        <Animated.View style={[styles.rightAction, { backgroundColor: error, transform: [{ translateX }] }]}>
            <Icon size={25} color={white} type="material-community" name="trash-can-outline" />
        </Animated.View>
    );
});

const LocalLibraryItem: FC<LocalLibraryProps & LocalLibraryItemProps> = memo(({ openFolder, deleteItem, item }) => {
    const {
        theme: {
            colors: { textColor }
        }
    } = useTheme();
    const swipeableRef = useRef<Swipeable>(null);
    const { openLocalFile } = usePlayer();
    const onItemPress = useCallback(() => {
        if (item.isDirectory) {
            openFolder(item);
        } else {
            openLocalFile(item);
        }
    }, [openLocalFile, item]);
    const onDeleteItem = useCallback(() => {
        //swipeableRef.current?.close();

        deleteItem(item);
    }, [deleteItem, item]);
    const renderRightAction = useCallback(
        (
            progress: Animated.AnimatedInterpolation<number>,
            drag: Animated.AnimatedInterpolation<string | number>,
            swipeable: Swipeable
        ) => <LocalLibraryItemAction progress={progress} swipeable={swipeable} />,
        [onDeleteItem]
    );

    return (
        <Swipeable
            ref={swipeableRef}
            enableTrackpadTwoFingerGesture
            onSwipeableOpen={onDeleteItem}
            renderRightActions={renderRightAction}
        >
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
        const { t } = useTranslation();
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
        const subItems = getSubItems() || [];

        return (
            <SafeAreaView style={[commonStyles.safeAreaView, { backgroundColor: background }]}>
                <View style={commonStyles.activityView}>
                    <ActivityIndicator animating={isRefreshing} size="small" color={textColor} />
                </View>
                {subItems.length ? (
                    <ScrollView
                        refreshControl={
                            <RefreshControl onRefresh={onRefresh} tintColor="transparent" refreshing={isRefreshing} />
                        }
                    >
                        {subItems.map((item) => (
                            <LocalLibraryItem
                                key={item.name}
                                item={item}
                                openFolder={openFolder}
                                deleteItem={deleteItem}
                            />
                        ))}
                    </ScrollView>
                ) : (
                    <View style={styles.msgCont}>
                        <Text h4 h4Style={{ color: textColor, fontSize: 14 }}>
                            {t('src.components.main.LocalLibrary.noItemsMsg1')}
                        </Text>
                        <View style={{ height: 20 }} />
                        <Text h4 h4Style={{ color: textColor, fontSize: 14 }}>
                            {t('src.components.main.LocalLibrary.noItemsMsg2')}
                        </Text>
                    </View>
                )}
            </SafeAreaView>
        );
    }
);

const styles = StyleSheet.create({
    msgCont: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    rightAction: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 15
    }
});

export default LocalLibrary;
