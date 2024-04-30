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
            colors: { background, primary, white }
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
                            containerStyle={{ backgroundColor: background }}
                        />
                        <View style={styles.nameCont}>
                            <Text h4 h4Style={{ color: primary }}>
                                {store.userInfo.user.name}
                            </Text>
                        </View>
                        <View style={styles.actionCont}>
                            <Button
                                onPress={signOut}
                                color="btnPrimary"
                                buttonStyle={styles.btn}
                                containerStyle={styles.btnCont}
                                title={t('src.components.main.Account.logOutBtnLabel')}
                            />
                        </View>
                    </View>
                ) : (
                    <View style={styles.mainCont}>
                        <View style={styles.logInInfoCont}>
                            <Text h4 h4Style={{ color: primary, fontSize: 14 }}>
                                {'sdhf sdfhksbd fhbs dhfh sbdfjhb sdhbfh bsdjhf hsdbfh bdsjhfb jdsbfj bsdjhfb jsbdf jsdf'}
                            </Text>
                        </View>
                        <View style={styles.actionCont}>
                            <Button
                                onPress={signIn}
                                color="btnPrimary"
                                icon={{
                                    name: 'google',
                                    type: 'material-community',
                                    size: 15,
                                    color: white
                                }}
                                buttonStyle={styles.btn}
                                containerStyle={styles.btnCont}
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
    actionCont: {
        marginTop: 20
    },
    btnCont: {
        width: 150,
        marginHorizontal: 50,
        marginVertical: 10
    },
    btn: {
        borderRadius: 10
    }
});

export default Account;
