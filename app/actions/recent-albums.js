import {
  RECENT_ALBUMS_REFRESHED,
  START_REFRESHING_ALBUMS,
  CLEANUP_RECENT_ALBUMS,
  ERROR_REFRESHING_ALBUMS,
} from '@reducers/recent-albums';
import { httpms } from '@components/httpms-service';
import { appendError } from '@actions/errors';
import { errorToMessage } from '@helpers/errors';

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
        const errMessage = errorToMessage(error);
        dispatch(errorRefreshingRecentAlbums(errMessage));
        dispatch(appendError(`Error while refreshing recently added albums ${errMessage}`));
      });
  };
};

export const cleanupRecentAlbums = () => ({
  type: CLEANUP_RECENT_ALBUMS,
});

export const errorRefreshingRecentAlbums = (error) => ({
  type: ERROR_REFRESHING_ALBUMS,
  error,
});
