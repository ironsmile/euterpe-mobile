
const initialState = {
    showQueue: false,
};

export const playerReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_VIEW_STATE:
            return {
                ...state,
                showQueue: !state.showQueue,
            };

        default:
            return state;
    }
};

export const TOGGLE_VIEW_STATE = 'Player/ToggleViewState';
