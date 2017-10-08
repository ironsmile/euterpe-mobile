import {
    RESULTS_FETCHED,
    START_SEARCH,
    HIDE_ACTIVITY_INDICATOR,
    SHOW_ACTIVITY_INDICATOR,
    SET_SEARCH_QUERY,
    CLEAR_RECENT_SEARCHES,
    CLEAR_SEARCH_RESULTS,
} from '@reducers/search';

export const setSearchQuery = (query) => ({
    type: SET_SEARCH_QUERY,
    query,
});

export const resultsFetched = (results) => ({
    type: RESULTS_FETCHED,
    results,
});

export const startSearch = (query) => ({
    type: START_SEARCH,
    query,
});

export const hideActivityIndicator = () => ({
    type: HIDE_ACTIVITY_INDICATOR,
});

export const showActivityIndicator = () => ({
    type: SHOW_ACTIVITY_INDICATOR,
});

export const clearRecentSearches = () => ({
    type: CLEAR_RECENT_SEARCHES,
});

export const clearSearchResults = () => ({
    type: CLEAR_SEARCH_RESULTS,
});
