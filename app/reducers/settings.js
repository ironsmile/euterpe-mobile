const initialState = {
  hostAddress: null,
  username: null,
  password: null,
  token: null,
  loggedIn: false,

  // This flag is set to true while a request for checking the settings is in progress
  checking: false,

  // This flag is set to true when a settings check had returned an invalid settings
  checkError: false,

  // Contains the last error from checking settings in human readable string
  checkErrorMessage: null,
};

export const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SETTINGS_CHANGED:
      return {
        ...state,
        ...action,
      };

    case SETTINGS_CHECK_STARTED:
      return {
        ...state,
        checking: true,
        checkError: false,
        checkErrorMessage: null,
      };

    case SETTINGS_CHECK_ENDED:
      return {
        ...state,
        checking: false,
      };

    case SETTINGS_CHECK_ERROR:
      return {
        ...state,
        checking: false,
        checkError: true,
        checkErrorMessage: action.message,
      };

    case SETTINGS_LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        password: null,
      };

    case SETTINGS_LOGOUT_SUCCESS:
      return {
        ...state,
        loggedIn: false,
        password: null,
        token: null,
      };

    default:
      return state;
  }
};

export const SETTINGS_CHANGED = 'Settings/Changed';
export const SETTINGS_CHECK_STARTED = 'Settings/CheckStarted';
export const SETTINGS_CHECK_ENDED = 'Settings/CheckEnded';
export const SETTINGS_CHECK_ERROR = 'Settings/CheckError';
export const SETTINGS_LOGIN_SUCCESS = 'Settings/LoginSuccess';
export const SETTINGS_LOGOUT_SUCCESS = 'Settings/LogoutSuccess';
