import { theme } from '@src/themes/default';
import { StyleSheet, Dimensions, Platform } from 'react-native';

const themeColors = theme.mode === 'dark' ? theme.darkColors : theme.lightColors;

const commonStyles = StyleSheet.create({
    inputContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: 'center',
        height: 110,
        maxHeight: 110
    },
    inputOutline: {
        borderColor: '#EFEFEF',
        borderWidth: 1,
        borderStyle: 'solid',
        backgroundColor: '#F8F8F8',
        borderRadius: 10
    },
    inputContent: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 12,
        paddingRight: 12
    },
    formActionBtn: {
        marginTop: 40
    },
    formHelperTextCont: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 50
    },
    linkText: {
        color: themeColors?.primary,
        textDecorationLine: 'underline'
    },
    safeAreaView: {
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: 'center',
        backgroundColor: '#fff'
    },
    scrollView: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20
    },
    rightAction: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    activityView: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    appBar: {
        height: 44,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EBEBEB',
        borderStyle: 'solid'
    },
    appBarModal: {
        height: 44,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#fff'
    },
    appBarHeaderTitle: {
        fontFamily: 'SuisseIntl-Bold',
        fontSize: Platform.OS === 'android' ? 18 : 17,
        lineHeight: 24,
        fontWeight: Platform.OS === 'android' ? 'bold' : 'normal',
        textAlign: 'center',
        textTransform: 'capitalize',
        color: '#1B1B1B'
    },
    listSection: {
        padding: 0,
        margin: 0,
        paddingBottom: 0,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        marginBottom: 0,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        paddingVertical: 0,
        paddingHorizontal: 0,
        marginVertical: 0,
        marginHorizontal: 0
    },
    listItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        maxHeight: 80,
        paddingBottom: 0,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE'
    },
    listItemTitle: {
        fontFamily: 'SuisseIntl-Regular',
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500',
        color: '#414040'
    },
    listItemDescr: {
        fontFamily: 'SuisseIntl-Regular',
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '400',
        color: '#9B9B9B',
        marginTop: 5
    },
    iconChevronRight: {
        height: 65,
        opacity: 0.5,
        marginRight: 15
    },
    modal: {
        marginBottom: 0
    }
});

export default commonStyles;
