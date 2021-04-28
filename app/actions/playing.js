import { Platform } from 'react-native';
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
  SET_SELECTED_TRACK,
  APPEND_IN_PLAYLIST,
  CLEANUP_PLAYING,
} from '@reducers/playing';

import MediaControl from '@components/media-control-shim';
import { setProgress, setDuration } from '@actions/progress';
import { httpms } from '@components/httpms-service';
import { addToRecentlyPlayed } from '@actions/recently-played';
import { mediaPlayer } from '@media-player/media-player';

// The time in ms between progress updates.
const progressUpdate = 1000;

// A setInterval timer for updating a track progress
let _timer = null;

// The unix timestamp of when the track has started.
let _startedTime = 0;

// Call detection manager
let _cdm = null;

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
};

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
  };
};

export const play = () => {
  return (dispatch, getState) => {
    const { playing } = getState();

    if (playing.trackLoading) {
      return;
    }

    dispatch(() => {
      mediaPlayer.play();
    });
  };
};

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
    MediaControl.resetNowPlaying();
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
};

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

export const setSelectedTrack = (track, index) => ({
  type: SET_SELECTED_TRACK,
  track,
  index,
});

export const setTrack = (index) => {
  return (dispatch, getState) => {
    mediaPlayer.setTrack(index, () => {
      mediaPlayer.play();
    });
  };
};

export const setPlayerAuthCreds = () => {
  return (dispatch) => {
    const headers = httpms.getAuthCredsHeader();
    mediaPlayer.setAuthenticationHeader(headers);
  };
};

const updateMediaControls = () => {
  return (dispatch, getState) => {
    const { playing, progress } = getState();
    const track = playing.playlist[playing.currentIndex];
    const mediaControlState = playing.paused
      ? MediaControl.STATE_PAUSED
      : MediaControl.STATE_PLAYING;

    const durCallback = (duration) => {
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
    };

    if (track.duration && track.duration > 0) {
      durCallback(track.duration / 1000);
    } else {
      mediaPlayer.getDuration(durCallback);
    }
  };
};

export const restorePlayingState = (errorHandler) => {
  return (dispatch, getState) => {
    mediaPlayer.init();

    dispatch(setPlayerAuthCreds());

    mediaPlayer.dispatch = dispatch;

    mediaPlayer.onError((error) => {
      dispatch(stopPlaying());
      if (errorHandler) {
        errorHandler(error);
      }
    });

    mediaPlayer.onMediaLoading(() => {
      MediaControl.resetNowPlaying();
      dispatch(trackIsLoading());
    });

    mediaPlayer.onMediaLoaded(() => {
      dispatch(trackLoaded());
      dispatch(updateMediaControls());
    });

    mediaPlayer.onPlayStarted(() => {
      dispatch({
        type: TOGGLE_PLAYING,
        play: true,
      });

      cleanupProgressTimer();
      setUpCallDetection(dispatch);

      const getTrack = () => {
        const state = getState();
        const index = state.playing.currentIndex;
        return state.playing.playlist[index];
      };

      const durCallback = (duration) => {
        dispatch(setDuration(duration));
        const track = getTrack();

        MediaControl.updatePlayback({
          state: MediaControl.STATE_PLAYING,
        });

        dispatch(addToRecentlyPlayed(track));

        if (duration <= 0) {
          return;
        }

        dispatch(startProgressTimer());
      };

      const track = getTrack();

      if (track.duration && track.duration > 0) {
        durCallback(track.duration / 1000);
      } else {
        mediaPlayer.getDuration(durCallback);
      }
    });

    const stopPauseCb = () => {
      cleanupProgressTimer();
      stopCallDetection();
      MediaControl.updatePlayback({
        state: MediaControl.STATE_PAUSED,
      });

      dispatch({
        type: TOGGLE_PLAYING,
        play: false,
      });
    };

    mediaPlayer.onPaused(stopPauseCb);
    mediaPlayer.onStopped(stopPauseCb);

    mediaPlayer.onPlayCompleted((success) => {
      cleanupProgressTimer();
      dispatch(trackEnded());
    });

    mediaPlayer.onTrackSet((index) => {
      const { playing } = getState();
      const track = playing.playlist[index];

      dispatch(selectTrack(track, index));
      setMuscControlNextPre(playing.playlist, index);
    });

    mediaPlayer.onPlaylistSet((playlist, currentIndex) => {
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

    mediaPlayer.onSeekCompleted((second) => {
      const { duration } = getState().progress;
      const pos = second / duration;
      cleanupProgressTimer();
      dispatch(setProgress(pos));
      MediaControl.updatePlayback({
        elapsedTime: second,
      });
      dispatch(startProgressTimer());
    });

    mediaPlayer.isPlaying((isPlaying, currentIndex) => {
      if (isPlaying) {
        dispatch({
          type: TOGGLE_PLAYING,
          play: true,
        });

        const { playlist } = getState().playing;

        if (currentIndex < 0 || currentIndex >= playlist.length) {
          if (errorHandler) {
            errorHandler(`Current track index ${currentIndex} outside of playlist size.`);
          }
          return;
        }

        const track = playlist[currentIndex];
        dispatch(setSelectedTrack(track, currentIndex));
        setMuscControlNextPre(playlist, currentIndex);
        dispatch(startProgressTimer());

        return;
      }

      const { playing, progress } = getState();

      if (!playing.now || !playing.now.id) {
        return;
      }

      dispatch(() => {
        mediaPlayer.setPlaylist(playing.playlist, playing.currentIndex);
        mediaPlayer.restorePlayerState(playing.shuffle, playing.repeat, playing.setRepeatSong);
      });

      if (playing.currentIndex !== null) {
        dispatch(() => {
          mediaPlayer.setTrack(playing.currentIndex, () => {
            mediaPlayer.seekTo(progress.value);
          });
        });
      }
    });
  };
};

export const cleanupPlaying = () => ({
  type: CLEANUP_PLAYING,
});

export const seekToSeconds = (seconds) => {
  return (dispatch, getState) => {
    if (seconds === 0) {
      mediaPlayer.seekTo(0);
      return;
    }

    const { playing } = getState();
    const index = playing.currentIndex;
    const track = playing.playlist[index];
    const pos = seconds / (track.duration / 1000);

    // pos must be a value in the range [0, 1].
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
  if (Platform.OS === 'android') {
    // Call detection on adroid is handled by the player service on the native
    // code side.
    return;
  }

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

const startProgressTimer = () => {
  return (dispatch, getState) => {
    const { duration } = getState().progress;

    mediaPlayer.getCurrentTime((seconds, isPlaying) => {
      cleanupProgressTimer();

      dispatch(setProgress(seconds / duration));
      if (!isPlaying) {
        return;
      }

      _startedTime = nowSeconds() - seconds;
      _timer = setInterval(() => {
        const playingTime = nowSeconds() - _startedTime;
        dispatch(setProgress(playingTime / duration));
        MediaControl.updatePlayback({
          elapsedTime: playingTime,
        });
      }, progressUpdate);
    });
  };
};

// nowSeconds returns the current unix timestamp in seconds.
const nowSeconds = () => {
  return Math.round(new Date().getTime() / 1000);
};
