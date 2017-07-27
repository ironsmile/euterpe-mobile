
const initialState = {
    results: [],
    query: '',
    searching: false,
};

export const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case RESULTS_FETCHED:
            return {
                ...state,
                query: action.query,
                results: action.results,
                searching: false,
            };

        case START_SEARCH:
            return {
                ...state,
                searching: true,
            };

        case HIDE_ACTIVITY_INDICATOR:
            return {
                ...state,
                searching: false,
            };

        default:
            return state;
    }
};

export const RESULTS_FETCHED = 'Search/ResultsFetched';
export const START_SEARCH = 'Search/Start';
export const HIDE_ACTIVITY_INDICATOR = 'Search/HideActivityIndicator';
