import MusicControl from 'react-native-music-control';
import CallDetectorManager from 'react-native-call-detection';
import Wakeful from 'react-native-wakeful';
const Sound = require('react-native-sound');

import {
    SET_PLAYLIST,
    TOGGLE_PLAYING,
    STOP,
    SET_IS_LOADING_STATUS,
    TRACK_ENDED,
    SELECT_TRACK,
} from '../reducers/playing';

import { setProgress } from '../actions/progress';
import { downloadSong } from '../actions/library';
import { HttpmsService } from '../common/httpms-service';

// The player instance which would be used in these action creators
let player = null;

// The cached httpms service object which would be used in these action creators
let _httpms = null;

// A setInterval timer for updating a track progress
let _timer = null;

// Call detection manager
let _cdm = null;

// Instance of the Wakeful class for keeping the CPU and WiFi awake during playback
const _wakeful = new Wakeful();

export const setPlaylist = (tracks) => ({
    type: SET_PLAYLIST,
    playlist: tracks,
});

export const togglePlaying = (play, fromCallManager = false, errorHandler = undefined) => {

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

            cleanupProgressTimer();

            _timer = setInterval(() => {
                player.getCurrentTime((seconds) => {
                    dispatch(setProgress(seconds / duration));
                });
            }, progressUpdate);
            // console.log(`Starting player playback with playCallback`);
            player.play(playCallback(dispatch, errorHandler));
        }

        if (player !== null && !statePlaying) {
            releaseLocks();
            cleanupProgressTimer();
            if (!fromCallManager) {
                stopCallDetection();
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
            play: statePlaying,
        });
    };
};

// The `hardStop` arguments means this would be the end of the playback and all resources
// should be released no matter what. On the other hand, when `hardStop` is false then
// new playback is expected immediately after this call so not all resources may be relesed.
export const stopPlaying = (hardStop = true) => {
    cleanupProgressTimer();
    stopCallDetection();

    if (hardStop) {
        releaseLocks();
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

export const trackEnded = (errorHandler) => {
    // console.log('Creating trackEnded action');

    return (dispatch, getState) => {
        const state = getState();
        const { currentIndex } = state.playing;

        // console.log(`Executing trackEnded for track with index ${currentIndex}`);

        cleanupProgressTimer();
        dispatch(stopPlaying(false));

        if (currentIndex >= state.playing.playlist.length - 1) {
            releaseLocks();

            return;
        }

        dispatch(setTrack(currentIndex + 1, errorHandler));
    };
};

export const previousSongInQueue = () => {
    return (dispatch, getState) => {
        const state = getState();
        const { currentIndex } = state.playing;

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

export const setTrack = (index, errorHandler) => {
    return (dispatch, getState) => {
        dispatch(stopPlaying(false));
        const state = getState();

        const track = state.playing.playlist[index];

        if (!track || !track.id) {
            // console.log(`Track index out of range: ${index}`);
            if (errorHandler) {
                errorHandler(`Track index out of range: ${index}`);
            }

            return;
        }

        MusicControl.resetNowPlaying();
        setMuscControlNextPre(state.playing.playlist, index);

        dispatch(selectTrack(track, index));
        dispatch(setProgress(0));

        const httpms = getHttpmsService(getState);

        // console.log(`Loading track ${track.id}`);
        dispatch(trackIsLoading());

        dispatch(downloadSong(track, errorHandler)).then((songPath) => {
            // console.log(`Track ${track.id} downloaded, creating player instance`);

            player = new Sound(songPath, undefined, (error) => {
                // console.log(`Loaded track ${track.id}`);
                if (error) {
                    if (errorHandler) {
                        errorHandler(`failed to load the sound: ${error}`);
                    }
                    // console.log('Error loading track:', error);
                    dispatch(stopPlaying());

                    return;
                }

                // Loaded successfully
                dispatch(trackLoaded());
                // console.log(`Track loaded ${track.id}. Dispatching togglePlaying`);
                dispatch(togglePlaying(true, false, errorHandler));

                MusicControl.setNowPlaying({
                  title: track.title,
                  artist: track.artist,
                  album: track.album,
                  duration: player.getDuration(),
                });
            });
        })
        .catch((error) => {
            // console.log(`Error downloading song ${track.id}`, error);
            dispatch(stopPlaying());
            if (errorHandler) {
                errorHandler(error);
            }
        });
    };
};

export const restorePlayingState = (errorHandler) => {
    return (dispatch, getState) => {
        if (player !== null) {
            return;
        }

        const state = getState();

        if (!state.playing.now || !state.playing.now.id) {
            return;
        }

        setMuscControlNextPre(state.playing.playlist, state.playing.currentIndex);
        dispatch(togglePlaying(false));

        const track = state.playing.now;
        const httpms = getHttpmsService(getState);
        const { progress } = state;

        dispatch(trackIsLoading());

        dispatch(downloadSong(track, errorHandler)).then((songPath) => {

            player = new Sound(songPath, undefined, (error) => {
                if (error) {
                    dispatch(stopPlaying());
                    if (errorHandler) {
                        errorHandler(error);
                    }

                    return;
                }

                const duration = player.getDuration();

                player.setCurrentTime(duration * progress);
                MusicControl.setNowPlaying({
                  title: track.title,
                  artist: track.artist,
                  album: track.album,
                  duration,
                });
                MusicControl.updatePlayback({
                    state: MusicControl.STATE_PAUSED,
                    elapsedTime: duration * progress,
                });
                dispatch(trackLoaded());
            });
        })
        .catch((error) => {
            dispatch(stopPlaying());
            if (errorHandler) {
                errorHandler(error);
            }
        });
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
            dispatch(setTrack(0, errorCallback));
        })
        .catch((error) => {
            if (errorCallback !== null) {
                errorCallback(error);
            }
        });
    };
};

const setMuscControlNextPre = (playlist, index) => {
    if (playlist[index + 1]) {
        MusicControl.enableControl('nextTrack', true);
    } else {
        MusicControl.enableControl('nextTrack', false);
    }

    if (index - 1 >= 0 && playlist[index - 1]) {
        MusicControl.enableControl('previousTrack', true);
    } else {
        MusicControl.enableControl('previousTrack', false);
    }
};

const cleanupProgressTimer = () => {
    if (_timer !== null) {
        clearInterval(_timer);
        _timer = null;
    }
};

const getHttpmsService = (getState) => {
    if (_httpms !== null) {
        return _httpms;
    }

    _httpms = new HttpmsService(getState().settings);

    return _httpms;
};

const playCallback = (dispatch, errorHandler) => {
    setUpCallDetection(dispatch);
    acquireLocks();

    return (success) => {
        // console.log('track playback ended');
        MusicControl.resetNowPlaying();
        if (success) {
            dispatch(trackEnded(errorHandler));
        } else {
            // console.log('playback failed due to audio decoding errors');
            if (errorHandler) {
                errorHandler('playback failed due to audio decoding errors');
            }
            dispatch(togglePlaying(false, false, errorHandler));
        }
    };
};

const setUpCallDetection = (dispatch) => {
    if (_cdm) {
        // Call detection is already active
        return;
    }

    _cdm = new CallDetectorManager((event) => {
        // For iOS event will be either "Connected",
        // "Disconnected","Dialing" and "Incoming"

        // For Android event will be either "Offhook",
        // "Disconnected" and "Incoming"

        if (event === 'Disconnected') {
            // Do something call got disconnected
            dispatch(togglePlaying(true, true));
        } else if (event === 'Connected') {
            // Do something call got connected
            // This clause will only be executed for iOS
        } else if (event === 'Incoming') {
            // Do something call got incoming
            dispatch(togglePlaying(false, true));
        } else if (event === 'Dialing') {
            // Do something call got dialing
            // This clause will only be executed for iOS
            dispatch(togglePlaying(false, true));
        } else if (event === 'Offhook') {
            // Device call state: Off-hook. 
            // At least one call exists that is dialing,
            // active, or on hold, 
            // and no calls are ringing or waiting.
            // This clause will only be executed for Android
            dispatch(togglePlaying(false, true));
        }
    });
};

const stopCallDetection = () => {
    if (!_cdm) {
        return;
    }
    _cdm.dispose();
    _cdm = null;
};

const acquireLocks = () => {
    // console.log('Wakeful lock acquired');
    _wakeful.acquire();
};

const releaseLocks = () => {
    // console.log('Wakeful lock released');
    _wakeful.release();
};
