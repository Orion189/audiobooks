import { useTheme, LinearProgress } from '@rneui/themed';
import store from '@src/store';
import { observer } from 'mobx-react-lite';

const ProgressBarBare = observer(() => {
    const {
        theme: {
            colors: { primary, white }
        }
    } = useTheme();

    return (
        <LinearProgress
            color={primary}
            trackColor={white}
            testID="progressBar"
            variant="indeterminate"
            style={{
                opacity: store.app.isProgressBarVisible ? 1 : 0
            }}
        />
    );
});

export default ProgressBarBare;
