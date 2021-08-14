import {
  RECENT_ARTISTS_REFRESHED,
  START_REFRESHING_ARTISTS,
  ERROR_REFRESHING_ARTISTS,
  CLEANUP_RECENT_ARTISTS,
} from '@reducers/recent-artists';
import { httpms } from '@components/httpms-service';
import { appendError } from '@actions/errors';
import { errorToMessage } from '@helpers/errors';

export const refreshRecentArtists = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { lastFetched } = state.recentArtists;

    const now = Date.now();

    if (now - lastFetched < 60 * 60 * 1000) {
      return;
    }

    dispatch({
      type: START_REFRESHING_ARTISTS,
    });

    const req = httpms.getRecentArtistsRequest();

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
          type: RECENT_ARTISTS_REFRESHED,
          artists: responseJson.data,
        });
      })
      .catch((error) => {
        const errMessage = errorToMessage(error);
        dispatch(errorRefreshingRecentArtists(errMessage));
        dispatch(appendError(`Error while refreshing recently added artists ${errMessage}`));
      });
  };
};

export const cleanupRecentArtists = () => ({
  type: CLEANUP_RECENT_ARTISTS,
});

export const errorRefreshingRecentArtists = (error) => ({
  type: ERROR_REFRESHING_ARTISTS,
  error,
});
