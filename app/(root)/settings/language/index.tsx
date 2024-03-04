import { useTheme, Icon, Button, Text, Header as HeaderRNE } from '@rneui/themed';
import Language from '@src/components/main/Language';
import ProgressBar from '@src/components/shared/ProgressBar';
import { useRouter, Stack } from 'expo-router';
import { useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';

const Header = memo(() => {
    const {
        theme: {
            colors: { primary }
        }
    } = useTheme();
    const router = useRouter();
    const { t } = useTranslation();
    const goToBackUrl = useCallback(() => router.push('/settings'), []);

    return (
        <>
            <HeaderRNE
                leftComponent={
                    <Button type="clear" onPress={goToBackUrl}>
                        <Icon name="arrow-left" type="material-community" color="white" />
                    </Button>
                }
                centerComponent={<Text h3>{t('app.settings.language.title')}</Text>}
                backgroundColor={primary}
            />
            <ProgressBar />
        </>
    );
});

const LanguagePage = memo(() => {
    const header = useCallback(() => <Header />, []);

    return (
        <>
            <Stack.Screen
                options={{
                    header
                }}
            />
            <Language />
        </>
    );
});

export default LanguagePage;
