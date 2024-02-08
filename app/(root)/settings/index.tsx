import { useTheme, Text, Header as HeaderRNE } from '@rneui/themed';
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
            <HeaderRNE centerComponent={<Text h3>{t('app.settings.index.title')}</Text>} backgroundColor={primary} />
            <ProgressBar />
        </>
    );
});

const SettingsPage = memo(() => {
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

export default SettingsPage;
