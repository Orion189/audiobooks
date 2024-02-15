import LocalLibraryView from '@src/components/main/LocalLibrary/LocalLibrary';
import * as remoteService from '@src/services/remote.service';
import store from '@src/store';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';

const LocalLibrary = observer(() => {
    return <LocalLibraryView />;
});

export default LocalLibrary;
