import store from '@src/store';
import { autorun } from 'mobx';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const useAppLang = () => {
    const { i18n } = useTranslation();

    useEffect(() => {
        autorun(() => i18n.changeLanguage(store.app.language));
    }, []);

    return null;
};

export default useAppLang;
