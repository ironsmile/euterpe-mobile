
const initialState = 0;

export const progressReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PROGRESS:
            return action.progress;

        case INCREASE_PROGRESS:
            return state + action.delta;

        default:
            return state;
    }
};
export const SET_PROGRESS = 'Progress/SetProgress';
export const INCREASE_PROGRESS = 'Progress/IncreaseProgress';
