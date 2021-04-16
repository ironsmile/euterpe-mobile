import {
  RECENT_ALBUMS_REFRESHED,
  START_REFRESHING_ALBUMS,
  STOPPED_REFRESHING_ALBUMS,
  CLEANUP_RECENT_ALBUMS,
} from '@reducers/recent-albums';
import { httpms } from '@components/httpms-service';

export const refreshRecentAlbums = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { lastFetched } = state.recentAlbums;

    const now = Date.now();

    if (now - lastFetched < 60 * 60 * 1000) {
      return;
    }

    dispatch({
      type: START_REFRESHING_ALBUMS,
    });

    const req = httpms.getRecentAlbumsRequest();

    Promise.race([
      fetch(req.url, {
        method: req.method,
        headers: req.headers,
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), 15000);
      }),
    ])
      .then((response) => {
        if (response.status !== 200) {
          throw response;
        }

        return response.json();
      })
      .then((responseJson) => {
        // !TODO: some validation checking
        dispatch({
          type: RECENT_ALBUMS_REFRESHED,
          albums: responseJson.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: STOPPED_REFRESHING_ALBUMS,
        });

        console.error('Error while refreshing recently added albums', error);
      });
  };
};

export const cleanupRecentAlbums = () => ({
  type: CLEANUP_RECENT_ALBUMS,
});
