
const initialState = {
    paused: true,
    trackLoading: false,
    playlist: [],
    curretIndex: null,
};

export const playingReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_PLAYING:
            if (action.play !== undefined) {
                return {
                    ...state,
                    paused: !action.play,
                };
            }

            return {
                ...state,
                paused: !state.paused,
            };

        case SET_PLAYLIST:
            return {
                ...state,
                playlist: action.playlist,
                currentIndex: null,
                paused: true,
                now: null,
            };

        case SELECT_TRACK:
            return {
                ...state,
                paused: true,
                now: action.track,
                trackLoading: true,
            };

        case SET_IS_LOADING_STATUS:
            return {
                ...state,
                trackLoading: action.status,
            };

        case TRACK_ENDED:
        case STOP:
            return {
                ...state,
                paused: true,
                now: null,
                currentIndex: null,
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
export const SET_PLAYLIST = 'Playing/SetPlaylist';
export const SET_IS_LOADING_STATUS = 'Playing/SetLoadigStatus';
export const TRACK_ENDED = 'Playing/TrackEnded';
