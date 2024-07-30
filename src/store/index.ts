import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoreValuesType } from '@src/@types';
import { LIB_TYPE } from '@src/enums';
import { makeObservable, observable, action } from 'mobx';
import { makePersistable, PersistStoreMap } from 'mobx-persist-store';
import { defaultState } from '@src/store/defaultState';

const isDebugMode = process.env.EXPO_PUBLIC_MOBX_DEBUG_MODE === 'true';

const makeReloadPersistable: typeof makePersistable = (object, options) => {
    for (const [key, store] of PersistStoreMap.entries()) {
        if (store.storageName === options.name) {
            store.stopPersisting();
            PersistStoreMap.delete(key);
        }
    }

    return makePersistable(object, options);
};

const store = makeObservable(
    {
        ...defaultState,
        set(key: keyof typeof defaultState, value: StoreValuesType) {
            Object.assign(this, {
                [key]: value
            });
        },
        setAppKey(value: Partial<StoreValuesType>) {
            Object.assign(this.app, value);
        },
        reset(key?: keyof typeof defaultState) {
            if (key) {
                // @ts-ignore
                this[key] = defaultState[key];
            } else {
                this['player'] = defaultState['player'];
                this['lib'] = defaultState['lib'];
                this[LIB_TYPE.REMOTE] = defaultState[LIB_TYPE.REMOTE];
                this[LIB_TYPE.LOCAL] = defaultState[LIB_TYPE.LOCAL];
                this['history'] = defaultState['history'];
                this['settings'] = defaultState['settings'];
                this['userInfo'] = defaultState['userInfo'];
                this['authInfo'] = defaultState['authInfo'];
                this['app'] = defaultState['app'];
            }
        }
    },
    {
        player: observable,
        lib: observable,
        [LIB_TYPE.REMOTE]: observable,
        [LIB_TYPE.LOCAL]: observable,
        history: observable,
        settings: observable,
        userInfo: observable,
        authInfo: observable,
        app: observable,
        set: action,
        reset: action
    },
    { autoBind: true }
);

/*
(async () => {
    await AsyncStorage.clear();
})();
*/
makeReloadPersistable(store, {
    storage: AsyncStorage,
    name: 'AudiobooksStore',
    properties: [
        'player',
        'lib',
        'settings',
        'userInfo',
        'authInfo',
        'app',
        'history',
        LIB_TYPE.REMOTE,
        LIB_TYPE.LOCAL
    ],
    debugMode: isDebugMode
});

export default store;
