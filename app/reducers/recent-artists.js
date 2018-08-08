
const initialState = {
    loading: false,
    lastFetched: 0,
    artists: [],
};

export const recentArtistsReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECENT_ARTISTS_REFRESHED:
            return {
                ...state,
                loading: false,
                artists: action.artists,
                lastFetched: Date.now(),
            };

        case START_REFRESHING_ARTISTS:
            return {
                ...state,
                loading: true,
            };

        case STOPPED_REFRESHING_ARTISTS:
            return {
                ...state,
                loading: false,
            };

        case CLEANUP_RECENT_ARTISTS:
            return {
                ...state,
                lastFetched: 0,
                artists: [],
            };

        default:
            return state;
    }
};

export const RECENT_ARTISTS_REFRESHED = 'RecentArtists/Refreshed';
export const START_REFRESHING_ARTISTS = 'RecentArtists/RefreshStarted';
export const STOPPED_REFRESHING_ARTISTS = 'RecentArtists/RefreshStopped';
export const CLEANUP_RECENT_ARTISTS = 'RecentArtists/Cleanup';
