import store from '@src/store';
import { reaction } from 'mobx';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const useAppLang = () => {
    const { i18n } = useTranslation();

    useEffect(() => {
        reaction(
            () => store.app.language,
            (language) => i18n.changeLanguage(language)
        );
    }, []);

    return null;
};

export default useAppLang;
