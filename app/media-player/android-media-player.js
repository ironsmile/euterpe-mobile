import { httpms } from '@components/httpms-service';
import { NativeModules, NativeEventEmitter } from 'react-native';

export class AndroidMediaPlayer {
    constructor() {
        this.java = NativeModules.MediaPlayer;

        this.mediaLoadingCallback = () => {};
        this.mediaLoadedCallback = () => {};
        this.playStartedCallback = () => {};
        this.playCompletedCallback = () => {};
        this.pauseCallback = () => {};
        this.stopCallback = () => {};
        this.playlistSetCallback = () => {};
        this.playlistAppendCallback = () => {};
        this.setTrackCallback = () => {};
        this.errorHandler = () => {};

        const eventEmitter = new NativeEventEmitter(this.java);
        
        this.errorSub = eventEmitter.addListener(
            'EVENT_ERROR',
            (params) => this.errorHandler(params.error)
        );

        this.mediaLoadingSub = eventEmitter.addListener(
            'EVENT_MEDIA_LOADING',
            () => this.mediaLoadingCallback()
        );

        this.mediaLoadedSub = eventEmitter.addListener(
            'EVENT_MEDIA_LOADED',
            () => this.mediaLoadedCallback()
        );

        this.playStartedSub = eventEmitter.addListener(
            'EVENT_PLAY_STARTED',
            () => this.playStartedCallback()
        );

        this.playCompletedSub = eventEmitter.addListener(
            'EVENT_PLAY_COMPLETED',
            (params) => this.playCompletedCallback(params.success)
        );

        this.pauseSub = eventEmitter.addListener(
            'EVENT_PAUSED',
            () => this.pauseCallback()
        );

        this.stopSub = eventEmitter.addListener(
            'EVENT_STOPPED',
            () => this.stopCallback()
        );

        this.setTrackSub = eventEmitter.addListener(
            'EVENT_TRACK_SET',
            (params) => this.setTrackCallback(params.index)
        );
    }

    init() {}

    play() {
        this.java.play();
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
        this.java.pause();
    }

    onPaused(callback) {
        this.pauseCallback = callback;
    }

    stop() {
        this.java.stop();
    }

    onStopped(callback) {
        this.stopCallback = callback;
    }

    setPlaylist(playlist, currentIndex) {
        const songsURLs = [];
        const playlistLength = playlist.length;

        for (let i = 0; i < playlistLength; i++) {
            songsURLs.push(httpms.getSongURL(playlist[i].id));
        }

        if (currentIndex !== undefined) {
            this.java.setCurrent(currentIndex);
        }

        this.java.setPlaylist(songsURLs, (index) => {
            this.playlistSetCallback(playlist, index);
        });
    }

    // onPlaylistSet is of the type func(playlist, currentIndex)
    onPlaylistSet(callback) {
        this.playlistSetCallback = callback;
    }

    appendPlaylist(songs) {

    }

    // callback is of the type func(songs)
    onPlaylistAppend(callback) {
        this.playlistAppendCallback = callback;
    }

    seekTo(progress) {

    }

    // successCallback is of type func()
    setTrack(index, successCallback) {
        this.java.setTrack(index, successCallback);
    }

    // callback is of the type func(index)
    onTrackSet(callback) {
        this.setTrackCallback = callback;
    }

    setShuffle(isSet) {
        this.java.setShuffle(isSet);
    }

    setRepeat(repeat, repeatSong) {
        if (repeatSong == null) {
            repeatSong = false;
        }
        this.java.setRepeat(repeat, repeatSong);
    }

    // callback is of type func (int duration) where duration is in seconds.
    getDuration(callback) {
        this.java.getDuration(callback);
    }

    setAuthenticationHeader(headers) {
        this.java.setAuthenticationHeader(headers);
    }

    // callback is of type func (int seconds, bool isPlaying).
    getCurrentTime(callback) {
        this.java.getCurrentTime(callback);
    }
}
