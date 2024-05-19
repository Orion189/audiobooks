import { useActionSheet } from '@expo/react-native-action-sheet';
import { useTheme, Icon, Slider, Text, Button } from '@rneui/themed';
import { PLAYBACK_RATE } from '@src/enums';
import store from '@src/store';
import { observer } from 'mobx-react-lite';
import NewRelic from 'newrelic-react-native-agent';
import { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Pressable, Platform } from 'react-native';

type CollapsedProps = {
    onClose: () => void;
    expandPlayer: () => void;
    width: number;
};

const ACTIONS_CONT_WIDTH = 130;

const Collapsed: FC<CollapsedProps> = observer(({ onClose, expandPlayer, width }) => {
    const {
        theme: {
            colors: { primary, background, divider, textColor }
        }
    } = useTheme();
    const { t } = useTranslation();
    const { showActionSheetWithOptions } = useActionSheet();
    const options = [
        PLAYBACK_RATE._0_5,
        PLAYBACK_RATE._0_75,
        PLAYBACK_RATE._1,
        PLAYBACK_RATE._1_25,
        PLAYBACK_RATE._1_5,
        PLAYBACK_RATE._1_75,
        PLAYBACK_RATE._2,
        t('src.components.shared.PlayerPopup.Collapsed.actionSheet.cancel')
    ];
    const title = t('src.components.shared.PlayerPopup.Collapsed.actionSheet.title');
    const cancelButtonIndex = options.length - 1;
    const showActionSheetCallback = useCallback(async (selectedIndex: number | undefined) => {
        if (selectedIndex !== undefined && selectedIndex !== cancelButtonIndex) {
            try {
                await store.player.sound?.setRateAsync(Number(options[selectedIndex]), true);
            } catch (e) {
                NewRelic.recordError(new Error('[Collapsed] - showActionSheetCallback', e as Error));
            }
        }
    }, []);
    const onChangeRate = useCallback(() => {
        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                title
            },
            showActionSheetCallback
        );
    }, [t, showActionSheetWithOptions]);

    return (
        <Pressable
            onPress={expandPlayer}
            style={[styles.overlay, { backgroundColor: background, borderTopColor: divider, borderTopWidth: 1 }]}
        >
            <View style={[styles.mainCont, { width, marginTop: 5 }]}>
                <Text
                    h4
                    h4Style={{ color: textColor, fontSize: 16 }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ width: width - ACTIONS_CONT_WIDTH }}
                >
                    {store.player.itemName}
                </Text>
                <View style={styles.actionsCont}>
                    <Button
                        type="clear"
                        title={store.player.rate?.toString()}
                        onPress={onChangeRate}
                        titleStyle={{ color: textColor }}
                    />
                    <Button type="clear" onPress={onClose}>
                        <Icon name="close" color={textColor} type="material-community" />
                    </Button>
                </View>
            </View>
            <Slider
                value={store.player.position}
                maximumValue={store.player.duration}
                minimumValue={0}
                step={1}
                style={styles.slider}
                minimumTrackTintColor={primary}
                trackStyle={styles.trackStyle}
                thumbStyle={[styles.thumbStyle, { backgroundColor: primary }]}
                thumbTouchSize={{ height: 5, width: 5 }}
            />
        </Pressable>
    );
});

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: Platform.OS === 'ios' ? 100 : 70,
        margin: 'auto',
        width: '100%',
        borderRadius: 0,
        height: 50
    },
    mainCont: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 5
    },
    actionsCont: {
        paddingHorizontal: 25,
        width: ACTIONS_CONT_WIDTH,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    slider: {
        width: '100%',
        height: 2,
        position: 'absolute',
        bottom: -1
    },
    trackStyle: {
        height: 2
    },
    thumbStyle: {
        height: 2,
        width: 2
    }
});

export default Collapsed;
