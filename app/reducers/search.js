
const initialState = {
    results: [],
    recentSearches: [],
    isSearching: false,
    query: null,
};

export const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case RESULTS_FETCHED:
            let recentSearches = [
                ...state.recentSearches,
                action.query,
            ];

            if (recentSearches.length > 10) {
                recentSearches = recentSearches.splice(1);
            }

            return {
                ...state,
                recentSearches,
                results: action.results,
                isSearching: false,
            };

        case START_SEARCH:
            return {
                ...state,
                isSearching: true,
                query: action.query,
            };

        case HIDE_ACTIVITY_INDICATOR:
            return {
                ...state,
                isSearching: false,
            };

        default:
            return state;
    }
};

export const RESULTS_FETCHED = 'Search/ResultsFetched';
export const START_SEARCH = 'Search/Start';
export const HIDE_ACTIVITY_INDICATOR = 'Search/HideActivityIndicator';
