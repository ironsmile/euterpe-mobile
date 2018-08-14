import CallDetectorManager from 'react-native-call-detection';
import Wakeful from 'react-native-wakeful';
import Images from '@assets/images';
const Sound = require('react-native-sound');

import {
    SET_PLAYLIST,
    TOGGLE_PLAYING,
    TOGGLE_SHUFFLE,
    TOGGLE_REPEAT,
    STOP,
    SET_IS_LOADING_STATUS,
    TRACK_ENDED,
    SELECT_TRACK,
    APPEND_IN_PLAYLIST,
} from '@reducers/playing';

import MediaControl from '@components/media-control-shim';
import { setProgress, setDuration } from '@actions/progress';
import { downloadSong } from '@actions/library';
import { httpms } from '@components/httpms-service';
import { addToRecentlyPlayed } from '@actions/recently-played';

// The player instance which would be used in these action creators
let player = null;

// A setInterval timer for updating a track progress
let _timer = null;

// Call detection manager
let _cdm = null;

// Instance of the Wakeful class for keeping the CPU and WiFi awake during playback
const _wakeful = new Wakeful();

export const setPlaylist = (tracks, startPlaying = false) => {
    return (dispatch) => {
        dispatch({
            type: SET_PLAYLIST,
            playlist: tracks,
        });

        if (startPlaying) {
            dispatch(setTrack(0));
        }
    };
};

export const appendToPlaylist = (songs) => ({
    type: APPEND_IN_PLAYLIST,
    songs,
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

        if (player === null && statePlaying) {
            dispatch(setTrack(state.playing.currentIndex, errorHandler, () => {
                dispatch(togglePlaying(true, fromCallManager, errorHandler));
            }));

            return;
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
                MediaControl.updatePlayback({
                  state: isPlaying ? MediaControl.STATE_PLAYING : MediaControl.STATE_PAUSED,
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

export const toggleShuffle = () => ({
    type: TOGGLE_SHUFFLE,
});

export const toggleRepeat = () => ({
    type: TOGGLE_REPEAT,
});

// The `hardStop` arguments means this would be the end of the playback and all resources
// should be released no matter what. On the other hand, when `hardStop` is false then
// new playback is expected immediately after this call so not all resources may be relesed.
export const stopPlaying = (hardStop = true) => {
    return (dispatch) => {
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

        dispatch({
            type: STOP,
        });
        dispatch(setProgress(0));
    };
};

export const trackLoaded = () => ({
    type: SET_IS_LOADING_STATUS,
    status: false,
});

export const trackIsLoading = () => {
    return (dispatch) => {
        dispatch({
            type: SET_IS_LOADING_STATUS,
            status: true,
        });
        dispatch(setDuration(null));
    };
};

export const trackEnded = (errorHandler, nextSongPressed = false) => {
    // console.log('Creating trackEnded action');

    return (dispatch, getState) => {
        const state = getState();
        const { currentIndex, repeatSong } = state.playing;

        // console.log(`Executing trackEnded for track with index ${currentIndex}`);

        cleanupProgressTimer();
        dispatch(stopPlaying(false));

        if (repeatSong && !nextSongPressed) {
            dispatch(setTrack(currentIndex, errorHandler));

            return;
        }

        const playlistLen = state.playing.playlist.length;

        if (state.playing.shuffle && playlistLen > 1) {
            let randomIndex = currentIndex;

            while (randomIndex === currentIndex) {
                randomIndex = parseInt(Math.random() * playlistLen, 10);
            }
            dispatch(setTrack(randomIndex, errorHandler));

            return;
        }

        if (currentIndex >= playlistLen - 1) {
            if (state.playing.repeat) {
                dispatch(setTrack(0, errorHandler));
            } else {
                releaseLocks();
            }

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
        dispatch(trackEnded(null, true));
    };
};

export const selectTrack = (track, index) => ({
    type: SELECT_TRACK,
    track,
    index,
});

export const setTrack = (index, errorHandler, successHandler) => {
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

        MediaControl.resetNowPlaying();
        setMuscControlNextPre(state.playing.playlist, index);

        dispatch(selectTrack(track, index));
        dispatch(setProgress(0));

        // console.log(`Loading track ${track.id}`);
        dispatch(trackIsLoading());

        dispatch(downloadSong(track, errorHandler)).then((songPath) => {

            if (player !== null) {
                console.error('Finished downloading song but an other one is currenlty playing');
                player.pause();
                player.release();
                player = null;
            }

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

                const duration = player.getDuration();

                // Loaded successfully
                dispatch(trackLoaded());
                // console.log(`Track loaded ${track.id}. Dispatching togglePlaying`);
                dispatch(togglePlaying(true, false, errorHandler));
                dispatch(setDuration(duration));

                MediaControl.setNowPlaying({
                  title: track.title,
                  artist: track.artist,
                  album: track.album,
                  artwork: httpms.getAlbumArtworkURL(track.album_id),
                  duration,
                });

                dispatch(addToRecentlyPlayed(track));
            });
        })
        .then(() => {
            if (successHandler) {
                successHandler();
            }
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
        const { progress } = state;

        dispatch(trackIsLoading());

        dispatch(downloadSong(track, errorHandler)).then((songPath) => {

            if (player !== null) {
                console.error('Finished downloading song but an other one is currenlty playing');
                player.pause();
                player.release();
                player = null;
            }

            player = new Sound(songPath, undefined, (error) => {
                if (error) {
                    dispatch(stopPlaying());
                    if (errorHandler) {
                        errorHandler(error);
                    }

                    return;
                }

                const duration = player.getDuration();

                player.setCurrentTime(duration * progress.value);
                MediaControl.setNowPlaying({
                  title: track.title,
                  artist: track.artist,
                  album: track.album,
                  artwork: httpms.getAlbumArtworkURL(track.album_id),
                  duration,
                });
                MediaControl.updatePlayback({
                    state: MediaControl.STATE_PAUSED,
                    elapsedTime: duration * progress.value,
                });
                dispatch(trackLoaded());
                dispatch(setDuration(duration));
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

export const seekToSeconds = (pos) => {
    return (dispatch, getState) => {
        if (player === null) {
            return;
        }

        player.setCurrentTime(pos);
    };
};

const setMuscControlNextPre = (playlist, index) => {
    if (playlist[index + 1]) {
        MediaControl.enableControl('nextTrack', true);
    } else {
        MediaControl.enableControl('nextTrack', false);
    }

    if (index - 1 >= 0 && playlist[index - 1]) {
        MediaControl.enableControl('previousTrack', true);
    } else {
        MediaControl.enableControl('previousTrack', false);
    }
};

const cleanupProgressTimer = () => {
    if (_timer !== null) {
        clearInterval(_timer);
        _timer = null;
    }
};

const playCallback = (dispatch, errorHandler) => {
    setUpCallDetection(dispatch);
    acquireLocks();

    return (success) => {
        // console.log('track playback ended');
        MediaControl.resetNowPlaying();
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
