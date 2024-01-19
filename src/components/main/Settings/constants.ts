import i18n from 'i18next';

const SERVER_HOSTNAME = process.env.EXPO_PUBLIC_SERVER_HOSTNAME;

if (!SERVER_HOSTNAME) {
    console.error('Environment variable SERVER_HOSTNAME is not defined');
}

export const SETTING_ITEMS = [
    {
        sectionTitle: i18n.t('app.settings.index.sections.general.title'),
        sectionItems: [
            {
                title: i18n.t('app.settings.index.sections.general.items.account.title'),
                subTitle: 'orion189@gmail.com',
                hasChevron: true,
                link: {
                    url: '/account',
                    isExternal: false
                }
            },
            {
                title: i18n.t('app.settings.index.sections.general.items.language.title'),
                subTitle: 'English',
                hasChevron: true,
                link: {
                    url: '/language',
                    isExternal: false
                }
            },
            {
                title: i18n.t('app.settings.index.sections.general.items.theme.title'),
                subTitle: 'light',
                hasChevron: true,
                link: {
                    url: '/theme',
                    isExternal: false
                }
            }
        ]
    },
    {
        sectionTitle: i18n.t('app.settings.index.sections.downloading.title'),
        sectionItems: [
            {
                title: i18n.t('app.settings.index.sections.downloading.items.downloaded.title'),
                hasChevron: true,
                link: {
                    url: '/downloaded-books',
                    isExternal: false
                }
            },
            {
                title: i18n.t('app.settings.index.sections.downloading.items.preferences.title'),
                hasChevron: true,
                link: {
                    url: '/downloading-preferences',
                    isExternal: false
                }
            }
        ]
    },
    {
        sectionTitle: i18n.t('app.settings.index.sections.support.title'),
        sectionItems: [
            {
                title: i18n.t('app.settings.index.sections.support.items.techSupport.title'),
                hasChevron: false
            },
            {
                title: i18n.t('app.settings.index.sections.support.items.rateApp.title'),
                hasChevron: true,
                link: {
                    url: 'https://google.com/',
                    isExternal: true
                }
            },
            {
                title: i18n.t('app.settings.index.sections.support.items.about.title'),
                hasChevron: true,
                link: {
                    url: `${SERVER_HOSTNAME}/about`,
                    isExternal: true
                }
            },
            {
                title: i18n.t('app.settings.index.sections.support.items.privacy.title'),
                hasChevron: true,
                link: {
                    url: `${SERVER_HOSTNAME}/privacy`,
                    isExternal: true
                }
            }
        ]
    }
];
