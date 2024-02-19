import { useTheme } from '@rneui/themed';
import { memo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const Loading = memo(() => {
    const {
        theme: {
            colors: { primary, white }
        }
    } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: white }]}>
            <ActivityIndicator size="large" color={primary} />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default Loading;
