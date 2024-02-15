import { useTheme, ListItem, Text } from '@rneui/themed';
import { THEME } from '@src/enums';
import store from '@src/store';
import commonStyles from '@src/styles/common';
import { observer } from 'mobx-react-lite';
import { useCallback, memo, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView } from 'react-native';

type ThemeProps = {
    changeTheme: (theme: THEME) => void;
};

const LocalLibrary: FC<ThemeProps> = memo(() => (
    <SafeAreaView style={commonStyles.safeAreaView}>
        <ScrollView>
            <Text>{'LocalLibrary'}</Text>
        </ScrollView>
    </SafeAreaView>
));

export default LocalLibrary;
