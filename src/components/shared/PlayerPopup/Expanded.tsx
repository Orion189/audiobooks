import { useTheme, Slider, Overlay, Icon, Text, Button } from '@rneui/themed';
import store from '@src/store';
import { observer } from 'mobx-react-lite';
import { useCallback, useState, FC, memo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

type ExpandedProps = {
    onCollapse: () => void;
};

const Expanded: FC<ExpandedProps> = memo(({ onCollapse }) => {
    const {
        theme: {
            colors: { primary, white }
        }
    } = useTheme();
    const play = useCallback(() => {
        store.set('playerItem', {
            ...store.playerItem,
            isPlaying: true
        });
    }, []);
    const pause = useCallback(() => {
        store.set('playerItem', {
            ...store.playerItem,
            isPlaying: false
        });
    }, []);
    const setPosition = useCallback(
        (position: number) => {
            pause();

            store.set('player', {
                ...store.player,
                position
            });

            play();
        },
        [pause, play]
    );
    const incrVolume = useCallback(() => {
        if (store.player.volume < 1) {
            store.set('player', {
                ...store.player,
                volume: store.player.volume + 0.1
            });
        }
    }, [store.player.volume]);
    const decrVolume = useCallback(() => {
        if (store.player.volume > 0) {
            store.set('player', {
                ...store.player,
                volume: store.player.volume - 0.1
            });
        }
    }, []);

    return (
        <Overlay isVisible onBackdropPress={onCollapse} overlayStyle={[styles.overlay, { backgroundColor: white }]}>
            <View style={styles.cont}>
                <View style={styles.timingCont}>
                    <Slider
                        value={store.player.position}
                        onSlidingComplete={setPosition}
                        maximumValue={store.player.duration}
                        minimumValue={0}
                        step={1}
                        allowTouchTrack
                        trackStyle={styles.trackStyle}
                        thumbStyle={[styles.thumbStyle, { backgroundColor: primary }]}
                        thumbTouchSize={{ height: 15, width: 15 }}
                    />
                    <View style={styles.timingValues}>
                        <Text>{store.player.position}</Text>
                        <Text>{store.player.duration}</Text>
                    </View>
                    <View style={styles.controlsCont}>
                        <Button onPress={decrVolume} type="clear">
                            {store.player.volume === 0 ? (
                                <Icon name="volume-variant-off" color={primary} type="material-community" />
                            ) : (
                                <Icon name="volume-low" color={primary} type="material-community" />
                            )}
                        </Button>
                        <Button onPress={() => {}} type="clear">
                            <Icon name="skip-previous" color={primary} type="material-community" />
                        </Button>
                        {store.playerItem.isPlaying ? (
                            <TouchableOpacity style={[styles.playPauseBtn, { borderColor: primary }]} onPress={pause}>
                                <Icon name="pause" color={primary} type="material-community" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={[styles.playPauseBtn, { borderColor: primary }]} onPress={play}>
                                <Icon name="play" color={primary} type="material-community" />
                            </TouchableOpacity>
                        )}
                        <Button onPress={() => {}} type="clear">
                            <Icon name="skip-next" color={primary} type="material-community" />
                        </Button>
                        <Button onPress={incrVolume} type="clear">
                            <Icon name="volume-high" color={primary} type="material-community" />
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
        paddingBottom: 40
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
