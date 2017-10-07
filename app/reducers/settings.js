
const initialState = {
    hostAddress: null,
    username: null,
    password: null,
    loggedIn: false,
};

export const settingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SETTINGS_CHANGED:
            return {
                ...state,
                hostAddress: action.hostAddress,
                username: action.username,
                password: action.password,
            };

        default:
            return state;
    }
};

export const SETTINGS_CHANGED = 'Settings/Changed';
