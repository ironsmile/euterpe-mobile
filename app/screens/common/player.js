import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,

} from 'react-native';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { setPlaylist, togglePlaying, setTrack, stopPlaying, trackLoaded } from '../../actions/playing';
import D from './dimensions';
import CoverFlowItem from './coverflow-item';
import { HttpmsService } from '../../common/httpms-service';

import MusicControl from 'react-native-music-control';
const Sound = require('react-native-sound');

let player = null;

class PlaylerRenderer extends Component {

    releaseSound() {
        if (player === null) {
            return;
        }

        player.stop();
        player.release();
        player = null;
    }

    onPreviousSong() {
    }

    onNextSong() {
    }

    onSetPlaylist(playlist) {
        this.props.dispatch(setPlaylist(playlist));
        this.setTrack(0);
    }

    setTrack(index) {
        this.releaseSound();
        const { playing } = this.props;
        const track = playing.playlist[index];

        if (!track) {
            return;
        }

        this.props.dispatch(setTrack(index));

        const trackURL = this.httpmsService.getTrackURL(track.id);

        player = new Sound(trackURL, undefined, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                this.props.dispatch(stopPlaying());
                return;
            }

            this.props.dispatch(trackLoaded());
            this.props.dispatch(togglePlaying(true));

            MusicControl.setNowPlaying({
              title: track.title,
              artist: track.artist,
              album: track.album,
              duration: player.getDuration(),
            });

            // Loaded successfully
            player.play((success) => {
                this.props.dispatch(stopPlaying());
                MusicControl.resetNowPlaying();
                if (success) {
                    player.release();
                    player = null;
                } else {
                    this.props.dispatch(stopPlaying());
                    console.log('playback failed due to audio decoding errors');
                }
                this.onSongEnd();
            });
        });
    }

    onTogglePlay(state) {
        this.props.dispatch(togglePlaying(state));
    }

    onSongEnd() {

    }

    componentWillMount() {
        this.httpmsService = new HttpmsService(this.props.settings);

        if (Platform.OS === 'ios') {
            Sound.setCategory('Playback');
        }

        MusicControl.enableBackgroundMode(true);
        MusicControl.enableControl('play', true);
        MusicControl.enableControl('pause', true);
        MusicControl.enableControl('stop', true);
        MusicControl.enableControl('nextTrack', true);
        MusicControl.enableControl('previousTrack', true);
        MusicControl.enableControl('seekForward', true);
        MusicControl.enableControl('seekBackward', true);

        MusicControl.on('play', () => {
            this.onTogglePlay(true);
        });

        MusicControl.on('pause', () => {
            this.onTogglePlay(false);
        });

        MusicControl.on('stop', () => {
            this.onStop();
        });

        MusicControl.on('nextTrack', () => {
            this.onNextSong();
        });

        MusicControl.on('previousTrack', () => {
            this.onPreviousSong();
        });

        MusicControl.on('seekForward', () => {

        });

        MusicControl.on('seekBackward', () => {

        });
    }

    renderHeader() {
        return (
            <View style={styles.header}>
                <TouchableOpacity onPress={() => this.props.scrollDown()}>
                    <View style={styles.downArrow}>
                        <Icon name='ios-arrow-down' color='white' size={24}/>
                    </View>
                </TouchableOpacity>
                <Text style={styles.playing}>NOW PLAYING</Text>
                <Icon name='ios-list' color='white' size={26}/>
            </View>
        );
    }

    renderCoverflow() {
        const width = D.width * 3.2/5,
            height = D.width * 3.2/5;

        const { nowPlaying } = this.props;

        let covers = [];

        if (nowPlaying) {
            covers.push(nowPlaying.image);
        }

        return (
            <ScrollView pagingEnabled={true} horizontal={true}>
                {covers.map((coverImage, i) => (
                    <CoverFlowItem
                        key={i}
                        page_width={D.width}
                        width={width}
                        height={height}
                        source={coverImage}
                    />
                ))}
            </ScrollView>
        )
    }

    renderInfo() {
        const { nowPlaying } = this.props;

        return (
            <View style={styles.infoContainer}>
                <View style={styles.titleContainer}>
                    <Icon name='ios-add' color='white' size={24}/>
                    <View style={styles.titleTextContainer}>
                        <Text
                            numberOfLines={1}
                            style={styles.title}
                        >
                            {nowPlaying.title}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={styles.artist}
                        >
                            {nowPlaying.artist}
                        </Text>
                    </View>
                    <Icon name='ios-more' color='white' size={24}/>
                </View>
                <View style={styles.progress} />
            </View>
        )
    }

    renderButtons() {
        const play = this.props.playing.paused;
        return (
            <View style={styles.buttonContainer}>
                <Icon name='ios-shuffle' size={24} color='#c2beb3'/>
                <Icon name='ios-skip-backward' size={32} color='white' />
                <TouchableOpacity
                    onPress={() => {
                        this.onTogglePlay();
                    }}
                    style={[styles.playContainer, play ? {paddingLeft: 8} : {}]}>
                    <Icon name={play ? 'ios-play' : 'ios-pause'} style={styles.play}/>
                </TouchableOpacity>
                <Icon name='ios-skip-forward' size={32} color='white' />
                <Icon name='ios-repeat' size={24} color='#c2beb3'/>

            </View>
        )
    }

    render() {
        if (!this.props.playing.now) {
            return null;
        }
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                {this.renderCoverflow()}
                {this.renderInfo()}
                {this.renderButtons()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    downArrow: {
        width: 40,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    header: {
        paddingRight: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 16,
    },

    playing: {
        color: 'white',
        fontWeight: '300',
        fontSize: 12,
        marginBottom: 12
    },

    infoContainer: {

    },

    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 32
    },

    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700'
    },

    artist: {
        color: 'white',
        fontSize: 14,
        fontWeight: '400'
    },


    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 16
    },

    playContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderColor: 'white',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    play: {
        color: 'white',
        backgroundColor:'transparent',
        margin: 16,
        fontSize: 48,
        fontWeight: '800'
    },

    progress: {
        height: 2,
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 16,
        backgroundColor: '#3c3d41'
    },

    text: {
        color: '#429962',
        fontSize: 10,
        marginBottom: 10,
        alignSelf: 'center',
        fontWeight: '300'
    },

    titleTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
});

const mapStateToProps = (state) => ({
    playing: state.playing,
    settings: state.settings,
});

export default Player = connect(mapStateToProps)(PlaylerRenderer);
