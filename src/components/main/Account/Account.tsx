import { Avatar, Text, Button, useTheme } from '@rneui/themed';
import store from '@src/store';
import commonStyles from '@src/styles/common';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, View, StyleSheet } from 'react-native';

type AccountProps = {
    signIn: () => void;
    signOut: () => void;
};

const Account: FC<AccountProps> = observer(({ signIn, signOut }) => {
    const {
        theme: {
            colors: { greyOutline, black, white }
        }
    } = useTheme();
    const { t } = useTranslation();

    return (
        <SafeAreaView style={commonStyles.safeAreaView}>
            <ScrollView>
                {store.userInfo.user.photo ? (
                    <View style={styles.mainCont}>
                        <Avatar
                            rounded
                            size={120}
                            source={{ uri: store.userInfo.user.photo }}
                            containerStyle={{ backgroundColor: greyOutline }}
                        />
                        <View style={styles.nameCont}>
                            <Text h4 h4Style={{ color: black }}>
                                {store.userInfo.user.name}
                            </Text>
                        </View>
                        <View style={styles.actionBtnCont}>
                            <Button
                                onPress={signOut}
                                color="secondary"
                                title={t('src.components.main.Account.logOutBtnLabel')}
                            />
                        </View>
                    </View>
                ) : (
                    <View style={styles.mainCont}>
                        <View style={styles.logInInfoCont}>
                            <Text h4 h4Style={{ fontSize: 14 }}>
                                {'sdhf sdfhksbd fhbs dhfh sbdfjhb sdhbfh bsdjhf hsdbfh bdsjhfb jdsbfj bsdjhfb jsbdf jsdf'}
                            </Text>
                        </View>
                        <View style={styles.actionBtnCont}>
                            <Button
                                onPress={signIn}
                                color="secondary"
                                icon={{
                                    name: 'google',
                                    type: 'material-community',
                                    size: 15,
                                    color: white
                                }}
                                title={t('src.components.main.Account.logInBtnLabel')}
                            />
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
});

const styles = StyleSheet.create({
    mainCont: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 30
    },
    nameCont: {
        marginTop: 20
    },
    logInInfoCont: {},
    actionBtnCont: {
        marginTop: 20
    }
});

export default Account;
