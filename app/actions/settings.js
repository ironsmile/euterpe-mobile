import {
  SETTINGS_CHANGED,
  SETTINGS_CHECK_STARTED,
  SETTINGS_CHECK_ENDED,
  SETTINGS_CHECK_ERROR,
  SETTINGS_LOGIN_SUCCESS,
  SETTINGS_LOGOUT_SUCCESS,
} from '@reducers/settings';
import { httpms } from '@components/httpms-service';
import { setPlayerAuthCreds } from '@actions/playing';

export const changeSettings = (newSettings) => {
  return (dispatch, getState) => {
    const currentSettings = getState().settings;
    dispatch({
      type: SETTINGS_CHANGED,
      ...currentSettings,
      ...newSettings,
    });

    if (newSettings.token) {
      dispatch(setPlayerAuthCreds());
    }
  };
};

export const checkSettings = (onOK, onError) => {
  return (dispatch, getState) => {
    dispatch({
      type: SETTINGS_CHECK_STARTED,
    });

    const req = httpms.getCheckSettingsRequest();

    Promise.race([
      fetch(req.url, {
        method: req.method,
        headers: req.headers,
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), 15000);
      }),
    ])
      .then((response) => {
        if (response.status !== 200) {
          throw response;
        }
        dispatch(checkEnded());
        if (onOK) {
          onOK(response.json());
        }
      })
      .catch((error) => {
        dispatch(checkEnded());
        if (onError) {
          onError(error);
        }
      });
  };
};

export const registerToken = (onOK, onError) => {
  return (dispatch, getState) => {
    const registerReq = httpms.getRegisterTokenRequest();

    let req;

    try {
      req = fetch(registerReq.url, {
        method: registerReq.method,
        headers: registerReq.headers,
      });
    } catch (error) {
      if (onError) {
        onError(error);
      }
      return;
    }

    Promise.race([
      req,
      new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('request timed out')), 15000);
      }),
    ])
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw response;
        }

        if (onOK) {
          onOK(response.json());
        }
      })
      .catch((error) => {
        if (onError) {
          onError(error);
        }
      });
  };
};

export const getToken = (onOK, onError) => {
  return (dispatch, getState) => {
    dispatch({
      type: SETTINGS_CHECK_STARTED,
    });

    const req = httpms.getTokenRequest();

    Promise.race([
      fetch(req.url, {
        method: req.method,
        headers: req.headers,
        body: req.body,
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('request timed out')), 15000);
      }),
    ])
      .then((response) => {
        if (response.status !== 200) {
          dispatch(checkEnded());
          throw response;
        }

        return response.json();
      })
      .then((respJson) => {
        if (!respJson.token) {
          dispatch(checkEnded());
          throw new Error('token is missing from response');
        }

        dispatch(
          changeSettings({
            token: respJson.token,
          })
        );

        const registerOK = (responseJson) => {
          dispatch(
            changeSettings({
              username: null,
              password: null,
            })
          );

          dispatch(checkEnded());
          if (onOK) {
            onOK(responseJson);
          }
        };

        const registerError = (error) => {
          dispatch(checkEnded());
          if (onError) {
            onError(error);
          }
        };

        dispatch(registerToken(registerOK, registerError));
      })
      .catch((error) => {
        dispatch(checkEnded());
        if (onError) {
          onError(error);
        }
      });
  };
};

export const checkEnded = () => ({
  type: SETTINGS_CHECK_ENDED,
});

export const checkError = (message) => ({
  type: SETTINGS_CHECK_ERROR,
  message,
});

export const finishLoginSuccess = () => ({
  type: SETTINGS_LOGIN_SUCCESS,
});

export const finishLogOut = () => {
  return (dispatch) => {
    dispatch({
      type: SETTINGS_LOGOUT_SUCCESS,
    });
    dispatch(
      changeSettings({
        hostAddress: null,
        username: null,
        password: null,
        token: null,
      })
    );
  };
};
