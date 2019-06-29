import { Platform } from 'react-native';
import { AndroidMediaPlayer } from '@media-player/android-media-player';
import { JavaScriptMediaPlayer } from '@media-player/javascript-media-player';

let MediaPlayer;

if (Platform.OS === 'android') {
    MediaPlayer = AndroidMediaPlayer;
} else {
    MediaPlayer = JavaScriptMediaPlayer;
}

export const mediaPlayer = new MediaPlayer();
