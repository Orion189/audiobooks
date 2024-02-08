import { useTheme, Text, Header as HeaderRNE } from '@rneui/themed';
import Library from '@src/components/main/Library';
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
            <HeaderRNE centerComponent={<Text h3>{t('app.library.index.title')}</Text>} backgroundColor={primary} />
            <ProgressBar />
        </>
    );
});

const LibraryPage = memo(() => {
    const header = useCallback(() => <Header />, []);

    return (
        <>
            <Stack.Screen
                options={{
                    header
                }}
            />
            <Library />
        </>
    );
});

export default LibraryPage;
