import CallDetectorManager from 'react-native-call-detection';

import {
    SET_PLAYLIST,
    TOGGLE_PLAYING,
    SET_SHUFFLE,
    SET_REPEAT,
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
        const { playing } = getState();
        const track = playing.playlist[playing.currentIndex];

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
            mediaPlayer.setTrack(0, () => {
                mediaPlayer.play();
            });
        }
    };
};

export const appendToPlaylist = (songs) => {
    return (dispatch) => {
        mediaPlayer.appendPlaylist(songs);
    };
}

export const togglePlaying = (doPlay) => {

    return (dispatch, getState) => {
        const { playing } = getState();

        if (playing.trackLoading) {
            return;
        }

        let statePlaying = doPlay;

        if (doPlay === undefined) {
            statePlaying = playing.paused;
        }

        if (statePlaying) {
            dispatch(play());
        } else {
            dispatch(pause());
        }
    };
};

export const pause = () => {
    return (dispatch, getState) => {
        const { playing } = getState();

        if (playing.trackLoading) {
            return;
        }

        dispatch(() => {
            mediaPlayer.pause();
        });
    }
}

export const play = () => {
    return (dispatch, getState) => {
        const { playing } = getState();

        if (playing.trackLoading) {
            return;
        }

        dispatch(() => {
            mediaPlayer.play();
        });
    }
}

export const toggleShuffle = () => {
    return (dispatch, getState) => {
        const { playing } = getState();
        const shuffle = !playing.shuffle;
        mediaPlayer.setShuffle(shuffle);

        dispatch({
            type: SET_SHUFFLE,
            shuffle,
        });
    };
};

export const toggleRepeat = () => {
    return (dispatch, getState) => {
        const { playing } = getState();

        let repeat = playing.repeat;
        let repeatSong = playing.repeatSong;

        if (repeat && !repeatSong) {
            repeatSong = true;
        } else {
            repeat = !repeat;
            repeatSong = false;
        }
        mediaPlayer.setRepeat(repeat, repeatSong);

        dispatch({
            type: SET_REPEAT,
            repeat,
            repeatSong,
        });
    };
};

export const stopPlaying = () => {
    return (dispatch) => {
        cleanupProgressTimer();
        stopCallDetection();

        dispatch({
            type: STOP,
        });
        dispatch(setProgress(0));
        mediaPlayer.stop();
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

// !TODO: why do we have trackEnded and stopPlaying
export const trackEnded = () => {
    return (dispatch) => {
        dispatch({
            type: TRACK_ENDED,
        });
        dispatch(setProgress(0));
    };
}

export const previousSongInQueue = () => {
    return (dispatch) => {
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
        mediaPlayer.setTrack(index, () => {
            if (successHandler) {
                successHandler();
            }
            mediaPlayer.play();
        });
    };
};

export const setPlayerAuthCreds = () => {
    return (dispatch) => {
        const headers = httpms.getAuthCredsHeader();
        mediaPlayer.setAuthenticationHeader(headers);
    }
}

const updateMediaControls = () => {
    return (dispatch, getState) => {
        const { playing, progress } = getState();
        const track = playing.playlist[playing.currentIndex];
        const mediaControlState = playing.paused ?
            MediaControl.STATE_PAUSED : MediaControl.STATE_PLAYING;

        mediaPlayer.getDuration((duration) => {
            MediaControl.setNowPlaying({
                title: track.title,
                artist: track.artist,
                album: track.album,
                artwork: httpms.getAlbumArtworkURL(track.album_id),
                duration,
            });
            MediaControl.updatePlayback({
                state: mediaControlState,
                elapsedTime: progress.value * duration,
            });
        });
    }
}

export const restorePlayingState = (errorHandler) => {
    return (dispatch, getState) => {
        mediaPlayer.init();

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
            dispatch(updateMediaControls());
        });

        mediaPlayer.onPlayStarted(() => {
            console.log("onPlayStarted");

            dispatch({
                type: TOGGLE_PLAYING,
                play: true,
            });

            cleanupProgressTimer();
            setUpCallDetection(dispatch);
            mediaPlayer.getDuration((duration) => {
                dispatch(setDuration(duration));

                const state = getState();
                const index = state.playing.currentIndex;
                const track = state.playing.playlist[index];

                MediaControl.updatePlayback({
                    state: MediaControl.STATE_PLAYING,
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

        mediaPlayer.onPaused(() => {
            console.log("onPaused");

            stopCallDetection();
            MediaControl.updatePlayback({
                state: MediaControl.STATE_PAUSED,
            });

            dispatch({
                type: TOGGLE_PLAYING,
                play: false,
            });
        });

        mediaPlayer.onStopped(() => {
            console.log("onStopped");

            stopCallDetection();
        });

        mediaPlayer.onPlayCompleted((success) => {
            console.log("onPlayCompleted", success);

            cleanupProgressTimer();
            dispatch(trackEnded());
        });

        mediaPlayer.onTrackSet((index) => {
            console.log("onTrackSet", index);

            const { playing } = getState();
            const track = playing.playlist[index];

            dispatch(selectTrack(track, index));
            setMuscControlNextPre(playing.playlist, index);
        });

        mediaPlayer.onPlaylistSet((playlist, currentIndex) => {
            console.log("onPlaylistSet", playlist);

            dispatch({
                type: SET_PLAYLIST,
                playlist,
            });
        });

        mediaPlayer.onPlaylistAppend((songs) => {
            dispatch({
                type: APPEND_IN_PLAYLIST,
                songs,
            });
        });

        const { playing, progress } = getState();

        if (!playing.now || !playing.now.id) {
            return;
        }

        dispatch(() => {
            console.log("mediaPlayer.setPlaylist playlist called!");
            mediaPlayer.setPlaylist(playing.playlist, playing.currentIndex);

            mediaPlayer.setShuffle(playing.shuffle);
            mediaPlayer.setRepeat(playing.repeat, playing.setRepeatSong);
        });

        if (playing.currentIndex !== null) {
            dispatch(() => {
                console.log("mediaPlayer.setTrack playlist called with seekTo!",
                    playing.currentIndex);
                mediaPlayer.setTrack(playing.currentIndex, () => {
                    mediaPlayer.seekTo(progress.value);
                });
            });
        }
    };
};

// pos must be a value in the range [0, 1].
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
            dispatch(togglePlaying(true));
        } else if (event === 'Connected') {
            // Do something call got connected
            // This clause will only be executed for iOS
        } else if (event === 'Incoming') {
            // Do something call got incoming
            dispatch(togglePlaying(false));
        } else if (event === 'Dialing') {
            // Do something call got dialing
            // This clause will only be executed for iOS
            dispatch(togglePlaying(false));
        } else if (event === 'Offhook') {
            // Device call state: Off-hook.
            // At least one call exists that is dialing,
            // active, or on hold,
            // and no calls are ringing or waiting.
            // This clause will only be executed for Android
            dispatch(togglePlaying(false));
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
