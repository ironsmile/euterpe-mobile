import { ADD_TO_RECENTLY_PLAYED } from '@reducers/recently-played';

export const addToRecentlyPlayed = (song) => {
    return (dispatch, getState) => {
        const album = {
            album_id: song.album_id,
            album: song.album,
            artist: song.artist,
        };

        const artist = {
            artist: song.artist,
        };

        dispatch({
            type: ADD_TO_RECENTLY_PLAYED,
            album,
            artist,
        });
    };
};