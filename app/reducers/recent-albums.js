const initialState = {
  error: null,
  loading: false,
  lastFetched: 0,
  albums: [],
};

export const recentAlbumsReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECENT_ALBUMS_REFRESHED:
      return {
        ...state,
        error: null,
        loading: false,
        albums: action.albums,
        lastFetched: Date.now(),
      };

    case START_REFRESHING_ALBUMS:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case STOPPED_REFRESHING_ALBUMS:
      return {
        ...state,
        loading: false,
      };

    case ERROR_REFRESHING_ALBUMS:
      return {
        ...state,
        loading: false,
        error: action.error,
        lastFetched: Date.now(),
      };

    case CLEANUP_RECENT_ALBUMS:
      return {
        ...state,
        lastFetched: 0,
        albums: [],
        error: null,
      };

    default:
      return state;
  }
};

export const RECENT_ALBUMS_REFRESHED = 'RecentAlbums/Refreshed';
export const START_REFRESHING_ALBUMS = 'RecentAlbums/RefreshStarted';
export const STOPPED_REFRESHING_ALBUMS = 'RecentAlbums/RefreshStopped';
export const ERROR_REFRESHING_ALBUMS = 'RecentAlbums/RefreshError';
export const CLEANUP_RECENT_ALBUMS = 'RecentAlbums/Cleanup';
