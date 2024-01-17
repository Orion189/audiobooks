import { Text } from '@rneui/themed';
import { SnackBarVariantType } from '@src/@types';
import { SNACKBAR_DURATION } from '@src/constants';
import { SnackBarVariant } from '@src/enums';
import store from '@src/store';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { StyleSheet } from 'react-native';
//import Snackbar from 'react-native-snackbar';

const SnackbarBare = observer(() => {
    const getSnackbarStyle = (type: SnackBarVariantType = SnackBarVariant.DEFAULT) => {
        switch (type) {
            case SnackBarVariant.DEFAULT:
                return styles.default;
            case SnackBarVariant.ERROR:
                return styles.error;
            case SnackBarVariant.INFO:
                return styles.info;
            case SnackBarVariant.SUCCESS:
                return styles.success;
            case SnackBarVariant.WARNING:
                return styles.warning;
        }
    };
    const dismissMsg = useCallback(() => store.set('app', { ...store.app, snackbar: null }), []);

    return null;/*(
        <Snackbar
            testID="snackBar"
            onDismiss={dismissMsg}
            visible={!!store.app.snackbar}
            style={getSnackbarStyle(store.app.snackbar?.type)}
            duration={store.app.snackbar?.duration ?? SNACKBAR_DURATION}
        >
            <Text style={styles.msg}>{store.app.snackbar?.message}</Text>
        </Snackbar>
    );*/
});

const styles = StyleSheet.create({
    msg: {
        color: '#fff',
        fontSize: 16
    },
    default: {
        backgroundColor: '#102445'
    },
    error: {
        backgroundColor: '#fa383e'
    },
    info: {
        backgroundColor: '#54c7ec'
    },
    success: {
        backgroundColor: '#00a400'
    },
    warning: {
        backgroundColor: '#ffba00'
    }
});

export default SnackbarBare;
