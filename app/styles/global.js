import { Platform } from 'react-native';

const fontFamily = 'Verdana';

export const gs = {
  bg: {
    backgroundColor: '#181818',
  },

  font: {
    color: 'white',
  },

  bolder: {
    fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
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

export const login = {
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonWrapper: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  subduedText: {
    marginTop: 5,
    color: '#aeafb3',
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
  },
  errorContaier: {
    marginTop: 20,
  },
};

export const recentlyAddedError = {
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginBottom: 24,
  },
  errorTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
};
