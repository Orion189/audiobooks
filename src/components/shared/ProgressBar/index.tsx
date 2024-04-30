import { useTheme, LinearProgress } from '@rneui/themed';
import store from '@src/store';
import { observer } from 'mobx-react-lite';

const ProgressBarBare = observer(() => {
    const {
        theme: {
            colors: { primary, background }
        }
    } = useTheme();
    const { isProgressBarVisible, value } = store.app.progressbar || {};

    return (
        <LinearProgress
            color={primary}
            trackColor={background}
            testID="progressBar"
            animation={isProgressBarVisible && !value}
            value={value}
            style={{
                opacity: isProgressBarVisible ? 1 : 0
            }}
        />
    );
});

export default ProgressBarBare;
