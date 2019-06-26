import { NativeModules, Platform } from 'react-native';
import { downloadSong } from '@actions/library';
const Sound = require('react-native-sound');

class AndroidMediaPlayer {
    constructor() {
      this.java = NativeModules.MediaPlayer;
    }

    play() {

    }

    onMediaLoading(callback) {

    }

    onPlayStarted(callback) {

    }

    // callback is of the type func(success bool)
    onPlayCompleted(callback) {

    }

    pause() {

    }

    onPaused(callback) {

    }

    stop() {

    }

    onStopped(callback) {

    }

    setPlaylist(playlist, currentIndex) {

    }

    // onPlaylistSet is of the type func(playlist, currentIndex)
    onPlaylistSet(callback) {

    }

    seekTo(progress) {

    }

    setTrack(index) {

    }

    // callback is of the type func()
    onTrackSet(callback) {

    }

    toggleShuffle() {

    }

    // callback is of type func (bool isShuffleOn).
    getShuffleState(callback) {

    }

    // callback is of type func (int duration) where duration is in seconds.
    getDuration(callback) {

    }

    setAuthenticationHeader(headers) {
        this.java.setAuthenticationHeader(headers);
    }

    playMedia(media) {
        this.java.playMedia(media);
    }

    // callback is of type func (int seconds, bool isPlaying).
    getCurrentTime(callback) {
        this.java.getCurrentTime(callback);
    }
}

class JavaScriptMediaPlayer {
    constructor() {
        this.player = null;

        this.playlist = [];
        this.current = 0;
        this.dispatch = null;
        this.shuffle = false;
        this.repeatSong = false;
        this.repeat = false;

        this.mediaLoadingCallback = () => {};
        this.mediaLoadedCallback = () => {};
        this.playStartedCallback = () => {};
        this.playCompletedCallback = () => {};
        this.pauseCallback = () => {};
        this.stopCallback = () => {};
        this.playlistSetCallback = () => {};
        this.setTrackCallback = () => {};
        this.errorHandler = () => {};
    }

    play() {
        if (this.player == null) {
            return;
        }

        this.playStartedCallback();
        this.player.play((success) => {
            this.playCompletedCallback(success);

            if (this.repeatSong) {
                this.seekTo(0);
                this.play();
                return;
            }

            const playlistLen = this.playlist.length;

            if (this.shuffle && playlistLen > 1) {
                let randomIndex = this.current;

                while (randomIndex === this.current) {
                    randomIndex = parseInt(Math.random() * playlistLen, 10);
                }

                this.setTrack(randomIndex, () => {
                    this.play();
                });
                return;
            }

            if (this.current >= playlistLen - 1) {
                if (this.repeat) {
                    this.setTrack(0, () => {
                        this.play();
                    });
                }

                return;
            }

            this.setTrack(this.current + 1, () => {
                this.play();
            });
        });
    }

    // callback is of type func(error string)
    onError(callback) {
        this.errorHandler = callback;
    }

    onMediaLoading(callback) {
        this.mediaLoadingCallback = callback;
    }

    onMediaLoaded(callback) {
        this.mediaLoadedCallback = callback;
    }

    onPlayStarted(callback) {
        this.playStartedCallback = callback;
    }

    // callback is of the type func(success bool)
    onPlayCompleted(callback) {
        this.playCompletedCallback = callback;
    }

    pause() {
        if (this.player == null) {
            return;
        }

        this.player.pause();
        this.pauseCallback();
    }

    onPaused(callback) {
        this.pauseCallback = callback;
    }

    _cleanupPlayer() {
        if (this.player == null) {
            return;
        }

        this.player.pause();
        this.player.release();
        this.player = null;
    }

    stop() {
        if (this.player == null) {
            return;
        }

        this._cleanupPlayer();
        this.stopCallback();
    }

    onStopped(callback) {
        this.stopCallback = callback;
    }

    setPlaylist(playlist, currentIndex) {
        this.playlist = playlist;

        if (currentIndex !== undefined) {
            this.current = currentIndex;
        }

        this.playlistSetCallback(this.playlist, this.current);
    }

    // onPlaylistSet is of the type func(playlist, currentIndex)
    onPlaylistSet(callback) {
        this.playlistSetCallback = callback;
    }

    // progress must be a number in the range [0, 1].
    seekTo(progress) {
        if (this.player == null) {
            return;
        }

        const duration = this.player.getDuration();
        this.player.setCurrentTime(duration * progress);
    }

    setTrack(index, onSuccess) {
        const playlistLen = this.playlist.length;
        if (index < 0 || index >= playlistLen) {
            this.errorHandler(`Index out of playlist range in setTrack: ${index}`);
            return;
        }

        const track = this.playlist[index];

        this.mediaLoadingCallback();
        this.dispatch(downloadSong(track, this.errorHandler)).then((songPath) => {
            this._cleanupPlayer();
            this.player = new Sound(songPath, undefined, (error) => {
                if (error) {
                    this.stop();
                    this.errorHandler(error);
                    return;
                }

                this.current = index;

                this.setTrackCallback(index);
                this.mediaLoadedCallback();
                if (onSuccess) {
                    onSuccess();
                }
            });
        })
        .catch((error) => {
            this.stop();
            this.errorHandler(error);
        });
    }

    // callback is of the type func(index)
    onTrackSet(callback) {
        this.setTrackCallback = callback;
    }

    setShuffle(isSet) {
        if (isSet !== true && isSet !== false) {
            return;
        }

        this.shuffle = isSet;
    }

    setRepeat(repeat, repeatSong) {
        this.repeat = repeat;
        this.repeatSong = repeatSong;
    }

    // callback is of type func (bool isShuffleOn).
    getShuffleState(callback) {
        callback(this.shuffle);
    }

    // callback is of type func (int duration) where duration is in seconds.
    getDuration(callback) {
        if (this.player == null) {
            callback(0);
            return;
        }

        callback(this.player.getDuration());
    }

    setAuthenticationHeader(headers) {
        // do nothing. JavaScript player does not need the credentials. It can
        // get them from the httpms service object.
    }

    playMedia(media) {
        // do nothing, just an example for java playing. To be removed.
    }

    // callback is of type func (int seconds, bool isPlaying).
    getCurrentTime(callback) {
        if (this.player == null) {
            callback(0, false);
            return;
        }

        this.player.getCurrentTime(callback);
    }

    next() {
        this._cleanupPlayer();
        this.playCompletedCallback(true);
    }

    previous() {
        this._cleanupPlayer();
        this.playCompletedCallback(true);
    }
}

let MediaPlayer;

if (Platform.OS === 'android-5') {
    MediaPlayer = AndroidMediaPlayer;
} else {
    MediaPlayer = JavaScriptMediaPlayer;
}

export const mediaPlayer = new MediaPlayer();
