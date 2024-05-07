import { useTheme, Text, Header as HeaderRNE } from '@rneui/themed';
import Settings from '@src/components/main/Settings';
import ProgressBar from '@src/components/shared/ProgressBar';
import commonStyles from '@src/styles/common';
import { Stack } from 'expo-router';
import { useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

const Header = memo(() => {
    const {
        theme: {
            colors: { headerBgColor, background, white }
        }
    } = useTheme();
    const { t } = useTranslation();

    return (
        <View style={{ backgroundColor: background }}>
            <HeaderRNE
                centerContainerStyle={commonStyles.centerComponentCont}
                containerStyle={commonStyles.header}
                centerComponent={
                    <Text h4 h4Style={{ color: white }}>
                        {t('app.settings.index.title')}
                    </Text>
                }
                backgroundColor={headerBgColor}
            />
            <ProgressBar />
        </View>
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
