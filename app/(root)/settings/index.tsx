import { useTheme, Icon, Button, Text, Header as HeaderRNE } from '@rneui/themed';
import Settings from '@src/components/main/Settings';
import ProgressBar from '@src/components/shared/ProgressBar';
import { Stack } from 'expo-router';
import { useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';

const Header = memo(() => {
    const {
        theme: {
            colors: { primary }
        }
    } = useTheme();
    const { t } = useTranslation();

    return (
        <>
            <HeaderRNE
                leftComponent={
                    <Button type="clear">
                        <Icon name="menu" color="white" />
                    </Button>
                }
                rightComponent={
                    <Button type="clear">
                        <Icon name="add" color="white" />
                    </Button>
                }
                centerComponent={<Text h3>{t('app.settings.index.title')}</Text>}
                backgroundColor={primary}
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
            <Settings />
        </>
    );
});

export default HomePage;
