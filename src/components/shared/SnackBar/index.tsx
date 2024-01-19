import { Text, Dialog, Button, Icon, useTheme } from '@rneui/themed';
import { SnackBarVariantType } from '@src/@types';
import { SNACKBAR_DURATION } from '@src/constants';
import { SnackBarVariant } from '@src/enums';
import store from '@src/store';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';

const Snackbar = observer(() => {
    const {
        theme: {
            colors: { primary, success, error, warning, greyOutline }
        }
    } = useTheme();
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const getSnackbarStyle = (type: SnackBarVariantType = SnackBarVariant.DEFAULT) => {
        switch (type) {
            case SnackBarVariant.DEFAULT:
                return { backgroundColor: greyOutline };
            case SnackBarVariant.ERROR:
                return { backgroundColor: error };
            case SnackBarVariant.INFO:
                return { backgroundColor: primary };
            case SnackBarVariant.SUCCESS:
                return { backgroundColor: success };
            case SnackBarVariant.WARNING:
                return { backgroundColor: warning };
        }
    };
    const dismissMsg = useCallback(() => store.set('app', { ...store.app, snackbar: null }), []);

    useEffect(() => {
        if (store.app.snackbar) {
            clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(dismissMsg, SNACKBAR_DURATION);
        } else {
            clearTimeout(timeoutRef.current);
        }
    }, [store.app.snackbar]);

    return (
        <Dialog
            onBackdropPress={dismissMsg}
            isVisible={!!store.app.snackbar}
            backdropStyle={{ opacity: 0 }}
            overlayStyle={{ ...styles.snackbarCont, ...getSnackbarStyle(store.app.snackbar?.type) }}
        >
            <Text style={styles.msg}>{store.app.snackbar?.message}</Text>
            <Button onPress={dismissMsg} type="clear">
                <Icon name="close" color="white" />
            </Button>
        </Dialog>
    );
});

const styles = StyleSheet.create({
    msg: {
        color: '#fff',
        fontSize: 16
    },
    snackbarCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
        paddingLeft: 20,
        position: 'absolute',
        left: 20,
        bottom: 120
    }
});

export default Snackbar;
