
const initialState = {
    loading: false,
    lastFetched: 0,
    albums: [],
};

export const recentAlbumsReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECENT_ALBUMS_REFRESHED:
            return {
                ...state,
                loading: false,
                albums: action.albums,
                lastFetched: Date.now(),
            };

        case START_REFRESHING_ALBUMS:
            return {
                ...state,
                loading: true,
            };

        case STOPPED_REFRESHING_ALBUMS:
            return {
                ...state,
                loading: false,
            };

        default:
            return state;
    }
};

export const RECENT_ALBUMS_REFRESHED = 'RecentAlbums/Refreshed';
export const START_REFRESHING_ALBUMS = 'RecentAlbums/RefreshStarted';
export const STOPPED_REFRESHING_ALBUMS = 'RecentAlbums/RefreshStopped';
