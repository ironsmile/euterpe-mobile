import { Platform } from 'react-native';

const fontFamily = 'Verdana';

export const gs = {

  bg: {
    backgroundColor: '#181818',
  },

  font: {
    color: 'white',
    // fontFamily: fontFamily,
  },

};

export const hs = {

  bg: {
    backgroundColor: 'rgba(27,27,27,.9)',
    position: 'absolute',
    height: (Platform.OS === 'ios') ? 50 : 30,
    top: 0,
    left: 0,
    right: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: null,
    elevation: 0,
    // backgroundColor: 'red',
  },

  font: {
    ...gs.font,
    fontWeight: 'normal',
  },

};
