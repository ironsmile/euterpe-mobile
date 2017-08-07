import { Platform } from 'react-native';

const fontFamily = 'Verdana';

export const gs = {

    bg: {
        backgroundColor: '#181818',
    },

    font: {
        color: 'white',
    },

    dropdownTitleStyle: {
        paddingTop: (Platform.OS === 'android') ? 24 : 0,
        fontSize: 16,
        textAlign: 'left',
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: 'transparent',
    },

    dropdownImageStyle: {
        padding: 8,
        paddingTop: (Platform.OS === 'android') ? 24 : 8,
        width: 36,
        height: 36,
        alignSelf: 'center'
    },

};

export const hs = {

    bg: {
        backgroundColor: 'rgba(27,27,27,.9)',
        position: 'absolute',
        height: 50,
        paddingTop: 14,
        top: 0,
        left: 0,
        right: 0,
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: null,
        elevation: 0,
    },

    font: {
        ...gs.font,
        fontWeight: 'normal',
    },

};
