import {
    SETTINGS_CHANGED,
    SETTINGS_CHECK_STARTED,
    SETTINGS_CHECK_ENDED,
    SETTINGS_CHECK_ERROR,
    SETTINGS_LOGIN_SUCCESS,
    SETTINGS_LOGOUT_SUCCESS,
} from '@reducers/settings';
import { HttpmsService } from '@components/httpms-service';

export const changeSettings = (newSettings) => {
    return (dispatch, getState) => {
        const currentSettings = getState().settings;

        dispatch({
            type: SETTINGS_CHANGED,
            ...currentSettings,
            ...newSettings,
        });
    };
};

export const checkSettings = (onOK, onError) => {
    return (dispatch, getState) => {
        dispatch({
            type: SETTINGS_CHECK_STARTED,
        });

        const httpms = new HttpmsService(getState().settings);
        const req = httpms.getRecentAlbumsRequest()

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
        dispatch(changeSettings({
            hostAddress: null,
            username: null,
            password: null,
        }));
    };
};

