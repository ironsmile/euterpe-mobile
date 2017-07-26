
const initialState = { paused: true };

export const playingReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_PLAYING:
            return {
                ...state,
                paused: !state.paused,
            };

        case SELECT_TRACK:
            return {
                ...state,
                paused: false,
                now: action.track,
            };

        case STOP:
            return {
                ...state,
                paused: true,
                now: undefined,
            };

        default:
            return state;
    }
};

export const TOGGLE_PLAYING = 'Playing/TogglePlay';
export const STOP = 'Playing/Stop';
export const NEXT = 'Playing/Next';
export const PREVIOUS = 'Playing/Previous';
export const SELECT_TRACK = 'Playing/SelectTrack';
