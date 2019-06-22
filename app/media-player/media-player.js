import { NativeModules, Platform } from 'react-native';

class AndroidMediaPlayer {
    constructor() {
      this.java = NativeModules.MediaPlayer;
    }

    startService() {
        this.java.startService();
    }

    getCurrentTime(callback) {
        this.java.getCurrentTime(callback);
    }
}

class DummyMediaPlayer {
    constructor() {}
    startService(){}
}

let MediaPlayer;

if (Platform.OS === 'android') {
    MediaPlayer = AndroidMediaPlayer;
} else {
    MediaPlayer = DummyMediaPlayer;
}

export const mediaPlayer = new MediaPlayer();
