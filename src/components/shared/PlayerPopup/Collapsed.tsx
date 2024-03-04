import { useTheme, Icon, Slider, Text, Button } from '@rneui/themed';
import store from '@src/store';
import { observer } from 'mobx-react-lite';
import { useState, FC, memo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

type ExpandedProps = {
    onClose: () => void;
    expandPlayer: () => void;
};

const Expanded: FC<ExpandedProps> = memo(({ onClose, expandPlayer }) => {
    const {
        theme: {
            colors: { primary, white }
        }
    } = useTheme();
    const [timing, setTiming] = useState(20);

    return (
        <Pressable onPress={expandPlayer} style={[styles.overlay, { backgroundColor: white }]}>
            <View style={styles.cont}>
                <Text>{'Hello world'}</Text>
                <Button type="clear" onPress={onClose}>
                    <Icon name="close" color={primary} type="material-community" />
                </Button>
            </View>
            <Slider
                value={timing}
                onValueChange={setTiming}
                maximumValue={100}
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
        bottom: 100,
        margin: 'auto',
        width: '100%',
        borderRadius: 0,
        height: 50
    },
    cont: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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

export default Expanded;
