import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '@rneui/themed';
import SnackBar from '@src/components/shared/SnackBar';
import { TAB_BAR_HEIGHT } from '@src/constants';
import * as Device from 'expo-device';
import { Tabs } from 'expo-router';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IconType = keyof typeof MaterialIcons.glyphMap;

type TabBarItemProps = {
    color: string;
    size?: number;
};

const getTabBarIcon = ({ color, size }: TabBarItemProps, iconName: IconType) => (
    <MaterialIcons name={iconName} size={size} color={color} />
);

const getTabBarLabel = ({ color }: TabBarItemProps, label: string) => (
    <Text h4 style={{ color }}>
        {label}
    </Text>
);

const Layout = memo(() => {
    const { t } = useTranslation();
    const { bottom } = useSafeAreaInsets();

    return (
        <>
            <Tabs
                initialRouteName="home"
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: { height: TAB_BAR_HEIGHT + bottom, justifyContent: 'center', alignItems: 'center' },
                    tabBarIconStyle: styles.tabBarIconStyle,
                    tabBarLabelStyle: styles.tabBarLabelStyle
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        tabBarIcon: ({ color, size }) => getTabBarIcon({ color, size }, 'home'),
                        tabBarLabel: ({ color }) => getTabBarLabel({ color }, t('app.tabs.home'))
                    }}
                />
                <Tabs.Screen
                    name="library"
                    options={{
                        tabBarIcon: ({ color, size }) => getTabBarIcon({ color, size }, 'local-library'),
                        tabBarLabel: ({ color }) => getTabBarLabel({ color }, t('app.tabs.library'))
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        tabBarIcon: ({ color, size }) => getTabBarIcon({ color, size }, 'settings'),
                        tabBarLabel: ({ color }) => getTabBarLabel({ color }, t('app.tabs.settings'))
                    }}
                />
            </Tabs>
            <SnackBar />
        </>
    );
});

const styles = StyleSheet.create({
    tabBarIconStyle: {
        marginRight: Device.deviceType === Device.DeviceType.TABLET ? 20 : 0
    },
    tabBarLabelStyle: {
        fontFamily: 'SuisseIntl-Regular',
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '400'
    }
});

export default Layout;
