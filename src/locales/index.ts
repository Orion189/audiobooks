import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import * as en from './en.json';
import * as ru from './ru.json';
import * as uk from './uk.json';

const resources = {
    en: { translation: en },
    ru: { translation: ru },
    uk: { translation: uk }
};

const lng = getLocales()[0].languageCode;

i18n.use(initReactI18next).init({
    resources,
    returnNull: false,
    lng,
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false // react already safes from xss
    }
});

export default i18n;
