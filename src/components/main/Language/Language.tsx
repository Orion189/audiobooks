import { useTheme, ListItem, Avatar } from '@rneui/themed';
import { LOCALE } from '@src/enums';
import store from '@src/store';
import commonStyles from '@src/styles/common';
import { observer } from 'mobx-react-lite';
import { useCallback, memo, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView } from 'react-native';

type LanguageProps = {
    changeLanguage: (locale: LOCALE) => void;
};

type LocaleItemProps = {
    locale: LOCALE;
    changeLanguage: (locale: LOCALE) => void;
};

const LocaleItem: FC<LocaleItemProps> = observer(({ locale, changeLanguage }) => {
    const { t } = useTranslation();
    const {
        theme: {
            colors: { background, disabled }
        }
    } = useTheme();
    const getAvatarSrc = useCallback(() => {
        switch (locale) {
            case LOCALE.EN:
                return require('@assets/flags/en.png');
            case LOCALE.UK:
                return require('@assets/flags/uk.png');
            case LOCALE.RU:
                return require('@assets/flags/ru.png');
        }
    }, [locale]);
    const changeLanguageCb = useCallback(() => changeLanguage(locale), [locale]);

    return (
        <ListItem
            bottomDivider
            onPress={changeLanguageCb}
            containerStyle={{ backgroundColor: store.app.language === locale ? disabled : background }}
        >
            <Avatar size={40} rounded source={getAvatarSrc()} />
            <ListItem.Content>
                <ListItem.Title>{t(`src.components.main.Language.locales.${locale}`)}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
    );
});

const Language: FC<LanguageProps> = memo(({ changeLanguage }) => {
    return (
        <SafeAreaView style={commonStyles.safeAreaView}>
            <ScrollView>
                {[LOCALE.EN, LOCALE.UK, LOCALE.RU].map((locale) => (
                    <LocaleItem key={locale} locale={locale} changeLanguage={changeLanguage} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
});

export default Language;
