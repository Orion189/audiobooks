import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, Icon, useTheme } from '@rneui/themed';
import useAppTheme from '@src/components/hooks/useAppTheme';
import PlayerPopup from '@src/components/shared/PlayerPopup';
import SnackBar from '@src/components/shared/SnackBar';
import { TAB_BAR_HEIGHT } from '@src/constants';
import { NEW_RELIC } from '@src/enums';
import * as Device from 'expo-device';
import { usePathname, useGlobalSearchParams, Tabs } from 'expo-router';
import NewRelic from 'newrelic-react-native-agent';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IconType = keyof typeof MaterialCommunityIcons.glyphMap;

type TabBarItemProps = {
    color: string;
    size?: number;
};

const getTabBarIcon = ({ color, size }: TabBarItemProps, iconName: IconType) => (
    <Icon size={size} color={color} type="material-community" name={iconName} />
);

const getTabBarLabel = ({ color }: TabBarItemProps, label: string) => (
    <Text h4 style={{ color }}>
        {label}
    </Text>
);

const Layout = memo(() => {
    const {
        theme: {
            colors: { primary, tabBarBgColor, divider, tabBarDefaultColor, tabBarActiveColor }
        }
    } = useTheme();
    const { t } = useTranslation();
    const { bottom } = useSafeAreaInsets();
    const pathname = usePathname();
    const params = useGlobalSearchParams();

    useAppTheme();

    useEffect(() => {
        NewRelic.recordBreadcrumb(NEW_RELIC.ROUTE_CHANGE, new Map(Object.entries({ pathname, params })));
    }, [pathname, params]);

    return (
        <>
            <Tabs
                initialRouteName="home"
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        height: TAB_BAR_HEIGHT + bottom,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: tabBarBgColor,
                        borderTopWidth: 1,
                        borderTopColor: divider
                    },
                    tabBarIconStyle: styles.tabBarIconStyle,
                    tabBarLabelStyle: styles.tabBarLabelStyle
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        tabBarIcon: ({ focused, size }) =>
                            getTabBarIcon({ color: focused ? tabBarActiveColor : tabBarDefaultColor, size }, 'home'),
                        tabBarLabel: ({ focused }) =>
                            getTabBarLabel(
                                { color: focused ? tabBarActiveColor : tabBarDefaultColor },
                                t('app.tabs.home')
                            )
                    }}
                />
                <Tabs.Screen
                    name="library"
                    options={{
                        tabBarIcon: ({ focused, size }) =>
                            getTabBarIcon({ color: focused ? tabBarActiveColor : tabBarDefaultColor, size }, 'library'),
                        tabBarLabel: ({ focused }) =>
                            getTabBarLabel(
                                { color: focused ? tabBarActiveColor : tabBarDefaultColor },
                                t('app.tabs.library')
                            )
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        tabBarIcon: ({ focused, size }) =>
                            getTabBarIcon({ color: focused ? tabBarActiveColor : tabBarDefaultColor, size }, 'cog'),
                        tabBarLabel: ({ focused }) =>
                            getTabBarLabel(
                                { color: focused ? tabBarActiveColor : tabBarDefaultColor },
                                t('app.tabs.settings')
                            )
                    }}
                />
            </Tabs>
            <SnackBar />
            <PlayerPopup />
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
