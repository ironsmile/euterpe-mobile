
import MusicControl from 'react-native-music-control';
const Sound = require('react-native-sound');

import {
    SET_PLAYLIST,
    TOGGLE_PLAYING,
    STOP,
    SET_IS_LOADING_STATUS,
    TRACK_ENDED,
    SELECT_TRACK,
} from '../reducers/playing';

import { setProgress, } from '../actions/progress';
import { HttpmsService } from '../common/httpms-service';

let player = null;
let _httpms = null;
let _timer = null;

export const setPlaylist = (tracks) => ({
    type: SET_PLAYLIST,
    playlist: tracks,
});

export const togglePlaying = (play) => {

    return (dispatch, getState) => {
        const state = getState();

        if (state.playing.trackLoading) {
            return;
        }

        let statePlaying = play;

        if (play === undefined) {
            statePlaying = state.playing.paused;
        }

        if (player !== null && statePlaying) {
            const duration = player.getDuration();
            const progressUpdate = 1000;

            _timer = setInterval(() => {
                player.getCurrentTime((seconds) => {
                    dispatch(setProgress(seconds / duration));
                });
            }, progressUpdate);
            player.play(playCallback(dispatch));
        }

        if (player !== null && !statePlaying) {
            if (_timer !== null) {
                clearInterval(_timer);
                _timer = null;
            }
            player.pause();
        }

        if (player !== null) {
            player.getCurrentTime((seconds, isPlaying) => {
                MusicControl.updatePlayback({
                  state: isPlaying ? MusicControl.STATE_PLAYING : MusicControl.STATE_PAUSED,
                  elapsedTime: seconds,
                });
                dispatch(setProgress(seconds / player.getDuration()));
            });
        }

        dispatch({
            type: TOGGLE_PLAYING,
            statePlaying,
        });
    };
};

export const stopPlaying = () => {
    if (_timer !== null) {
        clearInterval(_timer);
        _timer = null;
    }

    if (player !== null) {
        player.stop();
        player.release();
        player = null;
    }

    return {
        type: STOP,
    };
};

export const trackLoaded = () => ({
    type: SET_IS_LOADING_STATUS,
    status: false,
});

export const trackIsLoading = () => ({
    type: SET_IS_LOADING_STATUS,
    status: true,
});

export const trackEnded = () => {
    return (dispatch, getState) => {
        const state = getState();
        const currentIndex = state.playing.currentIndex;

        dispatch({
            type: TRACK_ENDED,
        });

        if (!state.playing.playlist[currentIndex + 1]) {
            return;
        }

        dispatch(setTrack(currentIndex + 1));
    };
};

export const previousSongInQueue = () => {
    return (dispatch, getState) => {
        const state = getState();
        const currentIndex = state.playing.currentIndex;

        dispatch({
            type: TRACK_ENDED,
        });


        if (!state.playing.playlist[currentIndex - 1]) {
            return;
        }

        dispatch(setTrack(currentIndex - 1));
    };
};

export const nextSongInQueue = () => {
    return (dispatch) => {
        dispatch(trackEnded());
    };
};

export const selectTrack = (track, index) => ({
    type: SELECT_TRACK,
    track,
    index,
});

export const setTrack = (index) => {
    return (dispatch, getState) => {
        dispatch(stopPlaying());
        const state = getState();

        const track = state.playing.playlist[index];

        if (!track) {
            // console.log("Track index out of range!", index);
            return;
        }

        MusicControl.resetNowPlaying();
        dispatch(selectTrack(track, index));
        dispatch(setProgress(0));

        const httpms = getHttpmsService(getState);
        const trackURL = httpms.getTrackURL(track.id);

        player = new Sound(trackURL, undefined, (error) => {
            if (error) {
                // console.log('failed to load the sound', error);
                return dispatch(stopPlaying());
            }

            dispatch(trackLoaded());
            dispatch(togglePlaying(true));

            MusicControl.setNowPlaying({
              title: track.title,
              artist: track.artist,
              album: track.album,
              duration: player.getDuration(),
            });

            // Loaded successfully
            player.play(playCallback(dispatch));
        });

        return dispatch(trackIsLoading());
    };
};

export const restorePlayingState = () => {
    return (dispatch, getState) => {
        if (player !== null) {
            return;
        }

        const state = getState();

        if (state.playing.now === null) {
            return;
        }

        dispatch(togglePlaying(false));

        const track = state.playing.now;
        const httpms = getHttpmsService(getState);
        const trackURL = httpms.getTrackURL(track.id);
        const { progress } = state;


        player = new Sound(trackURL, undefined, (error) => {
            if (error) {
                // console.log('failed to load the sound', error);
                dispatch(stopPlaying());

                return;
            }

            const duration = player.getDuration();

            player.setCurrentTime(duration * progress);
            MusicControl.setNowPlaying({
              title: track.title,
              artist: track.artist,
              album: track.album,
              state: MusicControl.STATE_PAUSED,
              elapsedTime: duration * progress,
              duration,
            });
            dispatch(trackLoaded());
        });

        dispatch(trackIsLoading());
    };
};

export const playAlbum = (album, errorCallback = null) => {
    return (dispatch, getState) => {
        const httpms = getHttpmsService(getState);

        fetch(httpms.getSearchURL(album.album), {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...httpms.getAuthCredsHeader()
          },
        })
        .then((response) => {
            if (response.status !== 200) {
                throw response;
            }

            return response.json();
        })
        .then((responseJson) => {
            // !TODO: some validation checking
            const albumSongs = responseJson.filter((item) => {
                return item.album_id === album.albumID;
            });

            dispatch(setPlaylist(albumSongs));
            dispatch(setTrack(0));
        })
        .catch((error) => {
            if (errorCallback !== null) {
                errorCallback(error);
            }
        });

    };
};

const getHttpmsService = (getState) => {
    if (_httpms !== null) {
        return _httpms;
    }

    _httpms = new HttpmsService(getState().settings);

    return _httpms;
};

const playCallback = (dispatch) => {
    return (success) => {
        dispatch(stopPlaying());
        MusicControl.resetNowPlaying();
        if (success) {
            dispatch(trackEnded());
        } else {
            // console.log('playback failed due to audio decoding errors');
        }
    };
};
