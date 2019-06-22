import CallDetectorManager from 'react-native-call-detection';

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
import { httpms } from '@components/httpms-service';
import { addToRecentlyPlayed } from '@actions/recently-played';
import { mediaPlayer } from '@media-player/media-player';

// A setInterval timer for updating a track progress
let _timer = null;

// Call detection manager
let _cdm = null;

export const playMediaViaService = () => {
    return (dispatch, getState) => {
        const state = getState();
        const track = state.playing.playlist[state.playing.currentIndex];

        if (!track || !track.id) {
            console.error("track does not exist");
            return;
        }

        const songURL = httpms.getSongURL(track.id);

        mediaPlayer.playMedia(songURL);
    };
}

export const setPlaylist = (tracks, startPlaying = false) => {
    return (dispatch) => {
        mediaPlayer.setPlaylist(tracks, 0);

        if (startPlaying) {
            mediaPlayer.setTrack(0);
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

        if (statePlaying) {
            mediaPlayer.play();
        } else {
            mediaPlayer.pause();
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
export const stopPlaying = () => {
    return (dispatch) => {
        cleanupProgressTimer();
        stopCallDetection();

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

export const trackEnded = () => {
    return (dispatch) => {
        dispatch({
            type: TRACK_ENDED,
        });
    };
}

export const _old_trackEnded = (errorHandler, nextSongPressed = false) => {
    // console.log('Creating trackEnded action');

    return (dispatch, getState) => {
        const state = getState();
        const { currentIndex, repeatSong } = state.playing;

        // console.log(`Executing trackEnded for track with index ${currentIndex}`);

        cleanupProgressTimer();
        dispatch(stopPlaying());

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
            }

            return;
        }

        dispatch(setTrack(currentIndex + 1, errorHandler));
    };
};

export const previousSongInQueue = () => {
    return (dispatch, getState) => {
        mediaPlayer.previous();
    };
};

export const nextSongInQueue = () => {
    return (dispatch) => {
        mediaPlayer.next();
    };
};

export const selectTrack = (track, index) => ({
    type: SELECT_TRACK,
    track,
    index,
});

export const setTrack = (index, errorHandler, successHandler) => {
    return (dispatch, getState) => {
        mediaPlayer.setTrack(index);
        if (successHandler) {
            successHandler();
        }
    };
};

export const setPlayerAuthCreds = () => {
    return (dispatch) => {
        const headers = httpms.getAuthCredsHeader();
        mediaPlayer.setAuthenticationHeader(headers);
    }
}

export const restorePlayingState = (errorHandler) => {
    return (dispatch, getState) => {
        dispatch(setPlayerAuthCreds());

        mediaPlayer.dispatch = dispatch;

        mediaPlayer.onError((error) => {
            console.error('mediaPlayer.onError', error);

            dispatch(stopPlaying());
            if (errorHandler) {
                errorHandler(error);
            }
        });

        mediaPlayer.onMediaLoading(() => {
            console.log("onMediaLoading");

            MediaControl.resetNowPlaying();
            dispatch(trackIsLoading());
        });

        mediaPlayer.onMediaLoaded(() => {
            console.log("onMediaLoaded");

            dispatch(trackLoaded());
            dispatch(togglePlaying());
        });

        mediaPlayer.onPlayStarted(() => {
            console.log("onPlayStarted");

            cleanupProgressTimer();
            setUpCallDetection(dispatch);
            mediaPlayer.getDuration((duration) => {
                dispatch(setDuration(duration));

                const state = getState();
                const index = state.playing.currentIndex;
                const track = state.playing.playlist[index];

                MediaControl.updatePlayback({
                    state: MediaControl.STATE_PLAYING,
                    elapsedTime: 0,
                });

                console.log("with index and track", index, track);

                dispatch(addToRecentlyPlayed(track));

                if (duration <= 0) {
                    return;
                }

                const progressUpdate = 1000;
                _timer = setInterval(() => {
                    mediaPlayer.getCurrentTime((seconds, isPlaying) => {
                        dispatch(setProgress(seconds / duration));
                        if (!isPlaying) {
                            cleanupProgressTimer();
                        }
                    });
                }, progressUpdate);
            });
        });

        mediaPlayer.onPlayCompleted((success) => {
            console.log("onPlayCompleted", success);

            cleanupProgressTimer();
            dispatch(trackEnded());
            dispatch(stopPlaying());
        });

        mediaPlayer.onTrackSet((index) => {
            console.log("onTrackSet", index);

            const state = getState();
            const track = state.playing.playlist[index];

            mediaPlayer.getDuration((duration) => {
                MediaControl.setNowPlaying({
                    title: track.title,
                    artist: track.artist,
                    album: track.album,
                    artwork: httpms.getAlbumArtworkURL(track.album_id),
                    duration,
                });
                MediaControl.updatePlayback({
                    state: MediaControl.STATE_PAUSED,
                    elapsedTime: 0,
                });
            });

            dispatch(selectTrack(track, index));
            setMuscControlNextPre(state.playing.playlist, index);
        });

        mediaPlayer.onPlaylistSet((playlist, currentIndex) => {
            console.log("onPlaylistSet", playlist);

            dispatch({
                type: SET_PLAYLIST,
                playlist,
            });
        });

        const state = getState();

        if (!state.playing.now || !state.playing.now.id) {
            return;
        }

        console.log("pausing! cmon!");
        dispatch({
            type: STOP,
        });
        dispatch(() => {
            mediaPlayer.setPlaylist(state.playing.playlist, state.playing.currentIndex);

            if (state.playing.currentIndex !== null) {
                mediaPlayer.setTrack(state.playing.currentIndex);
                mediaPlayer.seekTo(state.progress.value);
            }
        })
    };
};

export const seekToSeconds = (pos) => {
    return () => {
        mediaPlayer.seekTo(pos);
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
