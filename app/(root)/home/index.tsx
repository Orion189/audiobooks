import { useTheme, Text, Icon, Button, Header as HeaderRNE } from '@rneui/themed';
import ProgressBar from '@src/components/shared/ProgressBar';
import commonStyles from '@src/styles/common';
import { Stack } from 'expo-router';
import { useCallback, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import Snackbar from 'react-native-snackbar';

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
                centerComponent={{ text: t('app.home.index.title'), style: commonStyles.appBarHeaderTitle }}
                backgroundColor={primary}
            />
            <ProgressBar />
        </>
    );
});

const HomePage = memo(() => {
    const header = useCallback(() => <Header />, []);

    useEffect(() => {
        Snackbar.show({
            text: 'Hello world',
            duration: 1000,
            action: {
                text: 'CLOSE',
                textColor: 'white',
                onPress: () => Snackbar.dismiss()
            }
        });
    }, []);

    return (
        <>
            <Stack.Screen
                options={{
                    header
                }}
            />
            <Text h3>Home</Text>
        </>
    );
});

export default HomePage;
