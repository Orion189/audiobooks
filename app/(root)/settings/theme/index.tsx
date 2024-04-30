import { useTheme, Icon, Button, Text, Header as HeaderRNE } from '@rneui/themed';
import Theme from '@src/components/main/Theme';
import ProgressBar from '@src/components/shared/ProgressBar';
import commonStyles from '@src/styles/common';
import { useRouter, Stack } from 'expo-router';
import { useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

const Header = memo(() => {
    const {
        theme: {
            colors: { primary, background, white }
        }
    } = useTheme();
    const router = useRouter();
    const { t } = useTranslation();
    const goToBackUrl = useCallback(() => router.push('/settings'), []);

    return (
        <View style={{ backgroundColor: background }}>
            <HeaderRNE
                containerStyle={commonStyles.header}
                centerContainerStyle={commonStyles.centerComponentCont}
                leftComponent={
                    <Button type="clear" onPress={goToBackUrl}>
                        <Icon name="arrow-left" type="material-community" color="white" />
                    </Button>
                }
                centerComponent={
                    <Text h4 h4Style={{ color: white }}>
                        {t('app.settings.theme.title')}
                    </Text>
                }
                backgroundColor={primary}
            />
            <ProgressBar />
        </View>
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
            <Theme />
        </>
    );
});

export default LanguagePage;
