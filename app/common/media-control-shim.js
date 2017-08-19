import { Platform } from 'react-native';
import MusicControl from 'react-native-music-control';

const DummyControl = {
    setNowPlaying: () => {},
    updatePlayback: () => {},
    resetNowPlaying: () => {},
    enableControl: () => {},
    enableBackgroundMode: () => {},
    on: () => {},
};

let MediaControl = null;

if ((Platform.OS === 'android' && Platform.Version < 21) || Platform.OS === 'windows') {
    MediaControl = DummyControl;
} else {
    MediaControl = MusicControl;
}

module.exports = MediaControl;
