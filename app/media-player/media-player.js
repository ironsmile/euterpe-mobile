import { NativeModules, Platform } from 'react-native';

class AndroidMediaPlayer {
    constructor() {
      this.java = NativeModules.MediaPlayer;
    }

    playMedia(media, token) {
        this.java.playMedia(media, token);
    }

    getCurrentTime(callback) {
        this.java.getCurrentTime(callback);
    }
}

class DummyMediaPlayer {
    constructor() {}
    playMedia(media, token){}
}

let MediaPlayer;

if (Platform.OS === 'android') {
    MediaPlayer = AndroidMediaPlayer;
} else {
    MediaPlayer = DummyMediaPlayer;
}

export const mediaPlayer = new MediaPlayer();
