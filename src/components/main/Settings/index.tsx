import { useTheme, ListItem, Icon } from '@rneui/themed';
import { SETTING_ITEMS } from '@src/components/main/Settings/constants';
import commonStyles from '@src/styles/common';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, memo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

type SettingItemLink = {
    url: string;
    isExternal: boolean;
};

type SettingItem = {
    title: string;
    subTitle?: string;
    hasChevron: boolean;
    link?: SettingItemLink;
};

type SettingSection = {
    sectionTitle: string;
    sectionItems: SettingItem[];
};

const Section = memo(({ sectionTitle }: Partial<SettingSection>) => {
    const {
        theme: {
            colors: { grey5 }
        }
    } = useTheme();

    return (
        <ListItem topDivider bottomDivider containerStyle={{ backgroundColor: grey5 }}>
            <ListItem.Content style={styles.itemContent}>
                <ListItem.Title>{sectionTitle}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
    );
});

const Item = memo(({ title, subTitle, hasChevron, link }: SettingItem) => {
    const {
        theme: {
            colors: { primary, white }
        }
    } = useTheme();
    const router = useRouter();
    const gotToLink = useCallback(
        (link: SettingItemLink) =>
            link.isExternal
                ? WebBrowser.openBrowserAsync(link.url, {
                      controlsColor: primary,
                      toolbarColor: white
                  })
                : router.push(link.url),
        []
    );

    return (
        <ListItem bottomDivider onPress={() => link && gotToLink(link)}>
            <ListItem.Content style={styles.itemContent}>
                <ListItem.Title>{title}</ListItem.Title>
                {subTitle ? <ListItem.Subtitle>{subTitle}</ListItem.Subtitle> : null}
            </ListItem.Content>
            {hasChevron ? (
                <ListItem.Chevron>
                    <Icon name="chevron-right" />
                </ListItem.Chevron>
            ) : null}
        </ListItem>
    );
});

const Settings = memo(() => (
    <SafeAreaView style={commonStyles.safeAreaView}>
        <ScrollView>
            {SETTING_ITEMS.map((settingSection: SettingSection) => (
                <View key={settingSection.sectionTitle}>
                    <Section sectionTitle={settingSection.sectionTitle} />
                    {settingSection.sectionItems.map((settingItem: SettingItem) => (
                        <Item
                            key={settingItem.title}
                            title={settingItem.title}
                            subTitle={settingItem.subTitle}
                            hasChevron={settingItem.hasChevron}
                        />
                    ))}
                </View>
            ))}
        </ScrollView>
    </SafeAreaView>
));

const styles = StyleSheet.create({
    itemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

export default Settings;
