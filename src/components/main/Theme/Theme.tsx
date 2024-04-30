import { useTheme, ListItem } from '@rneui/themed';
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

type ThemeItemProps = {
    theme: THEME;
    changeTheme: (theme: THEME) => void;
};

const ThemeItem: FC<ThemeItemProps> = observer(({ theme, changeTheme }) => {
    const { t } = useTranslation();
    const {
        theme: {
            colors: { primary, background, secondary }
        }
    } = useTheme();
    const changeThemeCb = useCallback(() => changeTheme(theme), [theme]);

    return (
        <ListItem
            bottomDivider
            onPress={changeThemeCb}
            containerStyle={{ backgroundColor: store.app.theme === theme ? secondary : background }}
        >
            <ListItem.Content>
                <ListItem.Title style={{ color: primary, fontWeight: '400' }}>
                    {t(`src.components.main.Theme.themes.${theme}`)}
                </ListItem.Title>
            </ListItem.Content>
        </ListItem>
    );
});

const Theme: FC<ThemeProps> = memo(({ changeTheme }) => (
    <SafeAreaView style={commonStyles.safeAreaView}>
        <ScrollView>
            {[THEME.LIGHT, THEME.DARK].map((theme) => (
                <ThemeItem key={theme} theme={theme} changeTheme={changeTheme} />
            ))}
        </ScrollView>
    </SafeAreaView>
));

export default Theme;
