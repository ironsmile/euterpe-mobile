
import { SET_PLAYLIST, TOGGLE_PLAYING, STOP, SET_IS_LOADING_STATUS } from '../reducers/playing';

export const setPlaylist = (tracks) => ({
    type: SET_PLAYLIST,
    playlist: tracks,
});

export const togglePlaying = (play) => ({
    type: TOGGLE_PLAYING,
    play,
});

export const stopPlaying = () => ({
    type: STOP,
});

export const trackLoaded = () => ({
    type: SET_IS_LOADING_STATUS,
    status: false,
});
