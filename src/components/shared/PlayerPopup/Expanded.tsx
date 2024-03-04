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
    const [timing, setTiming] = useState(0);

    return (
        <Overlay isVisible onBackdropPress={onCollapse} overlayStyle={[styles.overlay, { backgroundColor: white }]}>
            <View style={styles.cont}>
                <View style={styles.timingCont}>
                    <Slider
                        value={timing}
                        onValueChange={setTiming}
                        maximumValue={100}
                        minimumValue={0}
                        step={1}
                        allowTouchTrack
                        trackStyle={styles.trackStyle}
                        thumbStyle={[styles.thumbStyle, { backgroundColor: primary }]}
                        thumbTouchSize={{ height: 15, width: 15 }}
                    />
                    <View style={styles.timingValues}>
                        <Text>{timing}</Text>
                        <Text>{'100'}</Text>
                    </View>
                    <View style={styles.controlsCont}>
                        <Button onPress={() => {}} type="clear">
                            <Icon name="volume-low" color={primary} type="material-community" />
                        </Button>
                        <Button onPress={() => {}} type="clear">
                            <Icon name="skip-previous" color={primary} type="material-community" />
                        </Button>
                        <TouchableOpacity style={[styles.playBtn, { borderColor: primary }]}>
                            <Icon name="play" color={primary} type="material-community" />
                        </TouchableOpacity>
                        <Button onPress={() => {}} type="clear">
                            <Icon name="skip-next" color={primary} type="material-community" />
                        </Button>
                        <Button onPress={() => {}} type="clear">
                            <Icon name="volume-high" color={primary} type="material-community" />
                        </Button>
                    </View>
                </View>
            </View>
        </Overlay>
    );
});
// pause, volume-variant-off
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
    playBtn: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 25
    }
});

export default Expanded;
