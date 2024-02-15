import { useTheme, ListItem, Text } from '@rneui/themed';
import { THEME } from '@src/enums';
import store from '@src/store';
import commonStyles from '@src/styles/common';
import { observer } from 'mobx-react-lite';
import { useCallback, memo, FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView } from 'react-native';

type RemoteLibraryProps = {
    //changeTheme: (theme: THEME) => void;
};

const RemoteLibrary: FC<RemoteLibraryProps> = observer(() => {
    return (
        <SafeAreaView style={commonStyles.safeAreaView}>
            <ScrollView>
                <Text>{'RemoteLibrary'}</Text>
            </ScrollView>
        </SafeAreaView>
    );
});

export default RemoteLibrary;
