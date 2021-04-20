import { ADD_TO_RECENTLY_PLAYED, CLEANUP_RECENTLY_PLAYED } from '@reducers/recently-played';

export const addToRecentlyPlayed = (song) => {
  return (dispatch, getState) => {
    const album = {
      album_id: song.album_id,
      album: song.album,
      artist: song.artist,
    };

    const artist = {
      artist: song.artist,
      artist_id: song?.artist_id ?? null,
    };

    dispatch({
      type: ADD_TO_RECENTLY_PLAYED,
      album,
      artist,
    });
  };
};

export const cleanupRecentlyPlayed = () => ({
  type: CLEANUP_RECENTLY_PLAYED,
});
