import { Text, Header as HeaderRNE } from '@rneui/themed';
import ProgressBar from '@src/components/shared/ProgressBar';
import commonStyles from '@src/styles/common';
import { Stack } from 'expo-router';
import { useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';

const Header = memo(() => {
    const { t } = useTranslation();

    return (
        <>
            <HeaderRNE
                leftComponent={{
                    icon: 'menu',
                    color: '#fff'
                }}
                rightComponent={{
                    icon: 'add',
                    color: '#fff'
                }}
                centerComponent={{ text: 'Library', style: commonStyles.appBarHeaderTitle }}
                linearGradientProps={{
                    colors: ['red', 'pink'],
                    start: { x: 0, y: 0.5 },
                    end: { x: 1, y: 0.5 }
                }}
            />
            <ProgressBar />
        </>
    );
});

const HomePage = memo(() => {
    const header = useCallback(() => <Header />, []);

    return (
        <>
            <Stack.Screen
                options={{
                    header
                }}
            />
            <Text h3>Library</Text>
        </>
    );
});

export default HomePage;
