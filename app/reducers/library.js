
const initialState = {
    lru: [],
    maxAllowedSize: 30,
};

export const libraryReducer = (state = initialState, action) => {
    switch (action.type) {

        case CLEANUP_LIBRARY:
            return initialState;

        case RESET_LIBRARY:
            return {
                ...state,
                lru: action.lru,
            };

        case SONG_USED:
            let oldIndex = state.lru.indexOf(action.song.id);

            if (oldIndex === -1) {
                oldIndex = state.lru.length;
            }

            lru = [
                action.song.id,
                ...state.lru.slice(0, oldIndex),
                ...state.lru.slice(oldIndex + 1),
            ];

            return {
                ...state,
                lru,
            };

        default:
            return state;
    }
};

export const CLEANUP_LIBRARY = 'Library/Cleanup';
export const RESET_LIBRARY = 'Library/Restore';
export const SONG_USED = 'Library/SongUsed';
