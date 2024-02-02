import { useTheme, ListItem, Icon } from '@rneui/themed';
import store from '@src/store';
import commonStyles from '@src/styles/common';
import * as MailComposer from 'expo-mail-composer';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { observer } from 'mobx-react-lite';
import { useCallback, memo, FC } from 'react';
import { useTranslation } from 'react-i18next';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import * as StoreReview from 'expo-store-review';
import { SnackBarVariant } from '@src/enums';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

type SettingItemLink = {
    url: string;
    isExternal?: boolean;
};

type SettingItem = {
    title: string;
    subTitle?: string;
    hasChevron: boolean;
    onPress?: () => void;
};

type SettingSection = {
    sectionTitle: string;
    sectionItems: SettingItem[];
};

const SERVER_HOSTNAME = process.env.EXPO_PUBLIC_SERVER_HOSTNAME;
const SERVER_EMAIL = process.env.EXPO_PUBLIC_SERVER_EMAIL;

const Section: FC<Partial<SettingSection>> = memo(({ sectionTitle }) => {
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

const Item: FC<SettingItem> = memo(({ title, subTitle, hasChevron, onPress }) => (
    <ListItem bottomDivider onPress={onPress}>
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
));

const Settings = observer(() => {
    const { t } = useTranslation();
    const {
        theme: {
            colors: { primary, white }
        }
    } = useTheme();
    const router = useRouter();
    const gotToLink = useCallback((link: SettingItemLink) => {
        if (link.isExternal) {
            try {
                WebBrowser.openBrowserAsync(link.url, {
                    controlsColor: primary,
                    toolbarColor: white
                });
            } catch (e) {
                console.error(e);
            }

            return;
        }

        router.push(link.url);
    }, []);
    const openMail = useCallback(async () => {
        const isAvailable = await MailComposer.isAvailableAsync();
        const subject = `${Application.applicationName} - ${t(
            'src.components.main.Settings.sections.support.items.techSupport.mailTitle'
        )}`;
        const installationTime = await Application.getInstallationTimeAsync();
        const body = `
            Model name: ${Device.modelName}
            OS version: ${Device.osVersion}
            App version: ${Application.nativeApplicationVersion}
            Timestamp: ${new Date()},
            Installed: ${installationTime}
        `;

        if (isAvailable) {
            await MailComposer.composeAsync({
                subject,
                recipients: [SERVER_EMAIL || ''],
                ccRecipients: [store.user.email],
                body
            });
        } else {
            store.set('app', {
                ...store.app,
                snackbar: {
                    type: SnackBarVariant.WARNING,
                    message: t('app.errors.emailClientNotConfigured')
                }
            });
        }
    }, [store.user.email]);
    const reviewApp = useCallback(async () => {
        const isHasAction = await StoreReview.hasAction();
        const isAvailable = await StoreReview.isAvailableAsync();

        if (isAvailable && isHasAction) {
            await StoreReview.requestReview();
        }
    }, []);
    const SETTING_ITEMS: SettingSection[] = [
        {
            sectionTitle: t('src.components.main.Settings.sections.general.title'),
            sectionItems: [
                {
                    title: t('src.components.main.Settings.sections.general.items.account.title'),
                    subTitle: 'orion189@gmail.com',
                    hasChevron: true,
                    onPress: () =>
                        gotToLink({
                            url: '/settings/account',
                            isExternal: false
                        })
                },
                {
                    title: t('src.components.main.Settings.sections.general.items.language.title'),
                    subTitle: t(
                        `src.components.main.Settings.sections.general.items.language.locales.${store.app.language}`
                    ),
                    hasChevron: true,
                    onPress: () =>
                        gotToLink({
                            url: '/settings/language',
                            isExternal: false
                        })
                },
                {
                    title: t('src.components.main.Settings.sections.general.items.theme.title'),
                    subTitle: t(`src.components.main.Settings.sections.general.items.theme.themes.${store.app.theme}`),
                    hasChevron: true,
                    onPress: () =>
                        gotToLink({
                            url: '/settings/theme',
                            isExternal: false
                        })
                }
            ]
        },
        {
            sectionTitle: t('src.components.main.Settings.sections.downloading.title'),
            sectionItems: [
                {
                    title: t('src.components.main.Settings.sections.downloading.items.downloaded.title'),
                    hasChevron: true,
                    onPress: () =>
                        gotToLink({
                            url: '/settings/downloaded-books',
                            isExternal: false
                        })
                },
                {
                    title: t('src.components.main.Settings.sections.downloading.items.preferences.title'),
                    hasChevron: true,
                    onPress: () =>
                        gotToLink({
                            url: '/settings/downloading-preferences',
                            isExternal: false
                        })
                }
            ]
        },
        {
            sectionTitle: t('src.components.main.Settings.sections.support.title'),
            sectionItems: [
                {
                    title: t('src.components.main.Settings.sections.support.items.techSupport.title'),
                    hasChevron: false,
                    onPress: openMail
                },
                {
                    title: t('src.components.main.Settings.sections.support.items.rateApp.title'),
                    hasChevron: false,
                    onPress: reviewApp
                },
                {
                    title: t('src.components.main.Settings.sections.support.items.about.title'),
                    hasChevron: true,
                    onPress: () =>
                        gotToLink({
                            url: `${SERVER_HOSTNAME}/about`,
                            isExternal: true
                        })
                },
                {
                    title: t('src.components.main.Settings.sections.support.items.privacy.title'),
                    hasChevron: true,
                    onPress: () =>
                        gotToLink({
                            url: `${SERVER_HOSTNAME}/privacy`,
                            isExternal: true
                        })
                }
            ]
        }
    ];

    return (
        <SafeAreaView style={commonStyles.safeAreaView}>
            <ScrollView>
                {SETTING_ITEMS.map((settingSection) => (
                    <View key={settingSection.sectionTitle}>
                        <Section sectionTitle={settingSection.sectionTitle} />
                        {settingSection.sectionItems.map((settingItem) => (
                            <Item
                                key={settingItem.title}
                                title={settingItem.title}
                                onPress={settingItem.onPress}
                                subTitle={settingItem.subTitle}
                                hasChevron={settingItem.hasChevron}
                            />
                        ))}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
});

const styles = StyleSheet.create({
    itemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

export default Settings;
