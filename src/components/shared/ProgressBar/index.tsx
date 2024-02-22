import { useTheme, LinearProgress } from '@rneui/themed';
import store from '@src/store';
import { observer } from 'mobx-react-lite';

const ProgressBarBare = observer(() => {
    const {
        theme: {
            colors: { primary, white }
        }
    } = useTheme();
    const { isProgressBarVisible, value } = store.app.progressbar || {};

    return (
        <LinearProgress
            color={primary}
            trackColor={white}
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
