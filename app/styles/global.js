const fontFamily = 'Verdana';

export const gs = {

  bg: {
    backgroundColor: '#181818',
  },

  container: {
    width: '100%',
    height: '100%',
  },

  font: {
    color: 'white',
    fontFamily: fontFamily,
  },

};

export const hs = {

  bg: {
    backgroundColor: '#1b1b1b',
  },

  font: {
    ...gs.font,
    fontWeight: 'normal',
  },

};
