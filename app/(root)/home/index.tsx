import { useTheme, Text, Header as HeaderRNE } from '@rneui/themed';
import Home from '@src/components/main/Home';
import ProgressBar from '@src/components/shared/ProgressBar';
import commonStyles from '@src/styles/common';
import { Stack } from 'expo-router';
import { useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

const Header = memo(() => {
    const {
        theme: {
            colors: { primary, background, white }
        }
    } = useTheme();
    const { t } = useTranslation();

    return (
        <View style={{ backgroundColor: background }}>
            <HeaderRNE
                containerStyle={commonStyles.header}
                centerContainerStyle={commonStyles.centerComponentCont}
                centerComponent={
                    <Text h4 h4Style={{ color: white }}>
                        {t('app.home.index.title')}
                    </Text>
                }
                backgroundColor={primary}
            />
            <ProgressBar />
        </View>
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
            <Home />
        </>
    );
});

export default HomePage;
