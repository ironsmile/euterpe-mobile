
const initialState = {
    results: [],
    recentSearches: [],
    isSearching: false,
    showResults: false,
    query: null,
    topAlbums: [],
    topSongs: [],
};

export const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case RESULTS_FETCHED:
            const albums = {};
            const albumArray = [];
            let albumsLen = 0;

            action.results.forEach((song) => {
                if (albumsLen >= 5) {
                    return;
                }

                if (albums[song.album_id]) {
                    return;
                }

                albums[song.album_id] = true;

                albumArray.push({
                    album: song.album,
                    artist: song.artist,
                    albumID: song.album_id,
                });

                albumsLen += 1;
            });

            return {
                ...state,
                results: action.results,
                topSongs: action.results.slice(0, 5),
                topAlbums: albumArray,
                isSearching: false,
                showResults: true,
            };

        case START_SEARCH:
            let recentSearches = [];
            const index = state.recentSearches.indexOf(action.query);

            if (index === -1) {
                recentSearches = [
                    action.query,
                    ...state.recentSearches,
                ];
            } else {
                recentSearches = [
                    action.query,
                    ...state.recentSearches.slice(0, index),
                    ...state.recentSearches.slice(index+1),
                ];
            }

            if (recentSearches.length > 10) {
                recentSearches = recentSearches.slice(0, 10);
            }

            return {
                ...state,
                recentSearches,
                showResults: true,
                isSearching: true,
            };

        case CLEAR_SEARCH_RESULTS:
            return {
                ...state,
                showResults: false,
                results: [],
            };

        case CLEAR_RECENT_SEARCHES:
            return {
                ...state,
                recentSearches: [],
            };

        case SET_SEARCH_QUERY:
            return {
                ...state,
                query: action.query,
            };

        case HIDE_ACTIVITY_INDICATOR:
            return {
                ...state,
                isSearching: false,
            };

        case SHOW_ACTIVITY_INDICATOR:
            return {
                ...state,
                isSearching: true,
            };

        default:
            return state;
    }
};

export const RESULTS_FETCHED = 'Search/ResultsFetched';
export const START_SEARCH = 'Search/Start';
export const HIDE_ACTIVITY_INDICATOR = 'Search/HideActivityIndicator';
export const SHOW_ACTIVITY_INDICATOR = 'Search/ShowActivityIndicator';
export const SET_SEARCH_QUERY = 'Search/SetQuery';
export const CLEAR_RECENT_SEARCHES = 'Search/ClearRecent';
export const CLEAR_SEARCH_RESULTS = 'Search/ClearResults';
