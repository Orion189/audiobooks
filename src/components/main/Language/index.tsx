import LanguageView from '@src/components/main/Language/Language';
import { LOCALE } from '@src/enums';
import store from '@src/store';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

const Language = observer(() => {
    const changeLanguage = useCallback(
        (locale: LOCALE) => {
            store.set('app', { ...store.app, language: locale });
        },
        [store.app.language]
    );

    return <LanguageView changeLanguage={changeLanguage} />;
});

export default Language;
