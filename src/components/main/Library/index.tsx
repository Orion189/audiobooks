import LibraryView from '@src/components/main/Library/Library';
//import { THEME } from '@src/enums';
import * as remoteService from '@src/services/remote.service';
import store from '@src/store';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';

const Library = observer(() => {
    const changeTheme = useCallback(async () => {
        if (store.authInfo.accessToken) {
            const aboutData = await remoteService.about();

            console.log('aboutData:', aboutData);
        }
    }, [store.authInfo.accessToken]);

    useEffect(() => {
        changeTheme();
    }, [store.authInfo.accessToken]);

    return <LibraryView changeTheme={changeTheme} />;
});

export default Library;
