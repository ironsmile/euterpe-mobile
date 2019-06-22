import { NativeModules, Platform } from 'react-native';

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

    seekTo(seconds) {

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

class DummyMediaPlayer {
    constructor() {}
    playMedia(media){}
    getCurrentTime(callbacl){}
    setAuthenticationHeader(headers) {}
}

let MediaPlayer;

if (Platform.OS === 'android') {
    MediaPlayer = AndroidMediaPlayer;
} else {
    MediaPlayer = DummyMediaPlayer;
}

export const mediaPlayer = new MediaPlayer();
