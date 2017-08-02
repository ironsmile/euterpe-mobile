
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

import {
    increaseProgress,
    setProgress,
} from '../actions/progress';

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
            const duration = player.getDuration() * 1000;
            const progressUpdate = 1000;

            _timer = setInterval(() => {
                dispatch(increaseProgress(progressUpdate / duration));
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

        return dispatch({
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

export const trackEnded = () => ({
    type: TRACK_ENDED,
});

export const selectTrack = (track) => ({
    type: SELECT_TRACK,
    track,
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

        dispatch(selectTrack(track));
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
    return (dispatch) => {
        if (player === null) {
            dispatch(stopPlaying());
        }
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
