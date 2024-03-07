import { useTheme, Icon, Slider, Text, Button } from '@rneui/themed';
import store from '@src/store';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

type CollapsedProps = {
    onClose: () => void;
    expandPlayer: () => void;
};

const Collapsed: FC<CollapsedProps> = observer(({ onClose, expandPlayer }) => {
    const {
        theme: {
            colors: { primary, white }
        }
    } = useTheme();

    return (
        <Pressable onPress={expandPlayer} style={[styles.overlay, { backgroundColor: white }]}>
            <View style={styles.cont}>
                <Text>{store.playerItem.name}</Text>
                <Button type="clear" onPress={onClose}>
                    <Icon name="close" color={primary} type="material-community" />
                </Button>
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
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 5
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
