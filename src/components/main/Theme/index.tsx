import ThemeView from '@src/components/main/Theme/Theme';
import { THEME } from '@src/enums';
import store from '@src/store';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

const Theme = observer(() => {
    const changeTheme = useCallback(
        (theme: THEME) => {
            store.set('app', { ...store.app, theme });
        },
        [store.app.theme]
    );

    return <ThemeView changeTheme={changeTheme} />;
});

export default Theme;
