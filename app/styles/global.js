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
    height: 50,
    top: 0,
    left: 0,
    right: 0,
    // backgroundColor: 'red',
  },

  font: {
    ...gs.font,
    fontWeight: 'normal',
  },

};
