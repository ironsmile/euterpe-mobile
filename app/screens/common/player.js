import React from 'react';
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
import {
    setPlaylist,
    togglePlaying,
    setTrack,
    stopPlaying,
    trackLoaded,
    previousSongInQueue,
    nextSongInQueue,
} from '../../actions/playing';
import D from './dimensions';
import CoverFlowItem from './coverflow-item';
import MusicControl from 'react-native-music-control';
import TrackProgress from '../../common/track-progress';
import Images from '@assets/images';

class PlaylerRenderer extends React.Component {

    onPreviousSong() {
        this.props.dispatch(previousSongInQueue());
    }

    onNextSong() {
        this.props.dispatch(nextSongInQueue());
    }

    onTogglePlay(state) {
        this.props.dispatch(togglePlaying(state));
    }

    componentWillMount() {
        MusicControl.on('play', () => {
            this.onTogglePlay(true);
        });

        MusicControl.on('pause', () => {
            this.onTogglePlay(false);
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

        const playing = this.props.playing;

        let covers = [];

        if (playing) {
            covers.push(Images.unknownAlbum);
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
        const playing = this.props.playing;

        return (
            <View style={styles.infoContainer}>
                <View style={styles.titleContainer}>
                    <Icon name='ios-add' color='white' size={24}/>
                    <View style={styles.titleTextContainer}>
                        <Text
                            numberOfLines={1}
                            style={styles.title}
                        >
                            {playing.title}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={styles.artist}
                        >
                            {playing.artist}
                        </Text>
                    </View>
                    <Icon name='ios-more' color='white' size={24}/>
                </View>
                <TrackProgress
                    style={styles.progress}
                />
            </View>
        )
    }

    renderButtons() {
        const play = this.props.paused;
        return (
            <View style={styles.buttonContainer}>
                <Icon name='ios-shuffle' size={24} color='#c2beb3'/>
                <TouchableOpacity
                    onPress={this.onPreviousSong.bind(this)}
                >
                    <Icon name='ios-skip-backward' size={32} color='white' />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.onTogglePlay.bind(this)}
                    style={[styles.playContainer, play ? {paddingLeft: 8} : {}]}>
                    <Icon name={play ? 'ios-play' : 'ios-pause'} style={styles.play}/>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.onNextSong.bind(this)}
                >
                    <Icon name='ios-skip-forward' size={32} color='white' />
                </TouchableOpacity>
                <Icon name='ios-repeat' size={24} color='#c2beb3'/>

            </View>
        )
    }

    render() {
        if (!this.props.playing) {
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
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 16,
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
    playing: state.playing.now,
    paused: state.playing.paused,
});

export default Player = connect(mapStateToProps)(PlaylerRenderer);
