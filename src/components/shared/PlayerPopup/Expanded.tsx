import { useTheme, Slider, Overlay, Icon, Text, Button } from '@rneui/themed';
import { getMMSSFromMillis } from '@src/components/shared/PlayerPopup/helpers';
import store from '@src/store';
import { observer } from 'mobx-react-lite';
import NewRelic from 'newrelic-react-native-agent';
import { useCallback, FC, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

type ExpandedProps = {
    onCollapse: () => void;
    playPrevItem: () => void;
    playNextItem: () => void;
};

const Expanded: FC<ExpandedProps> = observer(({ onCollapse, playPrevItem, playNextItem }) => {
    const {
        theme: {
            colors: { primary, tabBarDefaultColor, textColor, background }
        }
    } = useTheme();
    const play = useCallback(async () => {
        const { position, sound } = store.player;

        try {
            await sound?.playFromPositionAsync?.(position);
        } catch (e) {
            NewRelic.recordError(new Error('[Expanded] - play', e as Error));
        }
    }, [store.player.sound]);
    const pause = useCallback(async () => {
        try {
            await store.player.sound?.pauseAsync();
        } catch (e) {
            NewRelic.recordError(new Error('[Expanded] - pause', e as Error));
        }
    }, [store.player.sound]);
    const setPosition = useCallback(
        async (position: number) => {
            try {
                if (store.player.isPlaying) {
                    await store.player.sound?.playFromPositionAsync(position);
                } else {
                    await store.player.sound?.setPositionAsync(position);
                }
            } catch (e) {
                NewRelic.recordError(new Error('[Expanded] - setPosition', e as Error));
            }
        },
        [store.player.isPlaying, store.player.sound]
    );
    const incrVolume = useCallback(async () => {
        if (store.player.volume < 1) {
            const volume = store.player.volume + 0.1;

            try {
                await store.player.sound?.setVolumeAsync(Number(volume.toPrecision(1)));
            } catch (e) {
                NewRelic.recordError(new Error('[Expanded] - incrVolume', e as Error));
            }
        }
    }, [store.player.volume, store.player.sound]);
    const decrVolume = useCallback(async () => {
        if (store.player.volume > 0) {
            const volume = store.player.volume - 0.1;

            try {
                await store.player.sound?.setVolumeAsync(Number(volume.toPrecision(1)));
            } catch (e) {
                NewRelic.recordError(new Error('[Expanded] - decrVolume', e as Error));
            }
        }
    }, [store.player.volume, store.player.sound]);
    const position = useMemo(() => getMMSSFromMillis(store.player.position), [store.player.position]);
    const duration = useMemo(() => getMMSSFromMillis(store.player.duration), [store.player.duration]);

    return (
        <Overlay
            isVisible
            onBackdropPress={onCollapse}
            overlayStyle={[styles.overlay, { backgroundColor: background }]}
        >
            <View style={styles.cont}>
                <View style={styles.timingCont}>
                    <Text h4 h4Style={{ color: textColor, fontSize: 18 }} numberOfLines={1} ellipsizeMode="tail">
                        {store.player.itemName}
                    </Text>
                    <Slider
                        value={store.player.position}
                        onSlidingComplete={setPosition}
                        maximumValue={store.player.duration}
                        minimumValue={0}
                        step={1}
                        allowTouchTrack
                        trackStyle={[styles.trackStyle, { backgroundColor: tabBarDefaultColor }]}
                        thumbStyle={[styles.thumbStyle, { backgroundColor: primary }]}
                        thumbTouchSize={{ height: 15, width: 15 }}
                    />
                    <View style={styles.timingValues}>
                        <Text>{position}</Text>
                        <Text>{duration}</Text>
                    </View>
                    <View style={styles.controlsCont}>
                        <Button onPress={decrVolume} type="clear">
                            {store.player.volume === 0 ? (
                                <Icon name="volume-variant-off" color={textColor} type="material-community" />
                            ) : (
                                <Icon name="volume-low" color={textColor} type="material-community" />
                            )}
                        </Button>
                        <Button onPress={playPrevItem} type="clear">
                            <Icon name="skip-previous" color={textColor} type="material-community" />
                        </Button>
                        {store.player.isPlaying ? (
                            <TouchableOpacity style={[styles.playPauseBtn, { borderColor: textColor }]} onPress={pause}>
                                <Icon name="pause" color={textColor} type="material-community" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={[styles.playPauseBtn, { borderColor: textColor }]} onPress={play}>
                                <Icon name="play" color={textColor} type="material-community" />
                            </TouchableOpacity>
                        )}
                        <Button onPress={playNextItem} type="clear">
                            <Icon name="skip-next" color={textColor} type="material-community" />
                        </Button>
                        <Button onPress={incrVolume} type="clear">
                            <Icon name="volume-high" color={textColor} type="material-community" />
                        </Button>
                    </View>
                </View>
            </View>
        </Overlay>
    );
});

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        width: '100%',
        borderRadius: 15,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0
    },
    cont: {
        flex: 1,
        paddingBottom: 40,
        paddingTop: 10
    },
    trackStyle: {
        height: 5,
        backgroundColor: 'transparent'
    },
    thumbStyle: {
        height: 15,
        width: 15
    },
    timingCont: {
        flex: 1
    },
    timingValues: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    controlsCont: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    playPauseBtn: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 25
    }
});

export default Expanded;
