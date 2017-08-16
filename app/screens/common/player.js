import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
    StyleSheet,
} from 'react-native';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {
    setPlaylist,
    togglePlaying,
    toggleShuffle,
    toggleRepeat,
    setTrack,
    stopPlaying,
    trackLoaded,
    previousSongInQueue,
    nextSongInQueue,
} from '../../actions/playing';
import { togglePlayerViewState } from '../../actions/player';
import D from './dimensions';
import CoverFlowItem from './coverflow-item';
import MusicControl from 'react-native-music-control';
import { TimedProgress } from '../../common/track-progress';
import Images from '@assets/images';
import { FOOTER_HEIGHT } from './footer';
import { NowPlaying } from '../../common/now-playing-small';
import { PlayQueue } from '../../common/play-queue';

class PlaylerRenderer extends React.Component {

    onPreviousSong() {
        if (this.props.trackLoading) {
            return;
        }
        this.props.dispatch(previousSongInQueue());
    }

    onNextSong() {
        if (this.props.trackLoading) {
            return;
        }
        this.props.dispatch(nextSongInQueue());
    }

    onTogglePlay(state) {
        if (this.props.trackLoading) {
            return;
        }
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

    toggleViewState() {
        this.props.dispatch(togglePlayerViewState());
    }

    renderHeader() {
        const stateIcon = this.props.player.showQueue ? 'ios-list-box' : 'ios-list';

        return (
            <View style={styles.header}>
                <TouchableOpacity onPress={() => this.props.scrollDown()}>
                    <View style={styles.headerButton}>
                        <Icon name="ios-arrow-down" color="white" size={24}/>
                    </View>
                </TouchableOpacity>
                <Text style={styles.playing}>NOW PLAYING</Text>
                <TouchableOpacity onPress={this.toggleViewState.bind(this)}>
                    <View style={styles.headerButton}>
                        <Icon name={stateIcon} color="white" size={26}/>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    renderCoverflow() {
        const height = D.width * 3.2 / 5;
        const width = D.width * 3.2 / 5;
        const { playing } = this.props;
        const covers = [];

        if (playing) {
            covers.push(Images.unknownAlbum);
        }

        return (
            <ScrollView
                pagingEnabled={true}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {covers.map((coverImage, ind) => (
                    <CoverFlowItem
                        key={ind}
                        page_width={D.width}
                        width={width}
                        height={height}
                        source={coverImage}
                    />
                ))}
            </ScrollView>
        );
    }

    renderInfo() {
        const { playing, trackLoading } = this.props;

        return (
            <View style={styles.infoContainer}>
                <View style={styles.titleContainer}>
                    <Icon name="ios-add" color="white" size={24}/>
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
                    <Icon name="ios-more" color="white" size={24}/>
                </View>
                <TimedProgress
                    style={styles.progress}
                    loading={trackLoading}
                />
            </View>
        );
    }

    renderButtons() {
        const { paused, trackLoading, playlist, currentIndex } = this.props;
        const inactiveColor = '#5a6060';
        const disabledColor = '#5a6060';
        const iconColor = 'white';

        let prevButton = (
            <TouchableOpacity
                onPress={this.onPreviousSong.bind(this)}
            >
                <Icon name="ios-skip-backward" size={32} color={iconColor} />
            </TouchableOpacity>
        );

        if (currentIndex - 1 < 0 || !playlist[currentIndex - 1] || trackLoading) {
            prevButton = <Icon name="ios-skip-backward" size={32} color={disabledColor} />;
        }

        let nextButton = (
            <TouchableOpacity
                onPress={this.onNextSong.bind(this)}
            >
                <Icon name="ios-skip-forward" size={32} color={iconColor} />
            </TouchableOpacity>
        );

        if ((!playlist[currentIndex + 1] && !this.props.shuffle && !this.props.repeat) || trackLoading) {
            nextButton = <Icon name="ios-skip-forward" size={32} color={disabledColor} />;
        }

        let playButton = (
            <TouchableOpacity
                onPress={() => {
                    this.onTogglePlay();
                }}
                style={[
                    styles.playContainer,
                    paused ? { paddingLeft: 8 } : {},
                ]}>
                <Icon
                    name={paused ? 'ios-play' : 'ios-pause'}
                    style={styles.play}
                    color={iconColor}
                />
            </TouchableOpacity>
        );

        if (trackLoading) {
            playButton = (
                <View style={[
                    styles.playContainer,
                    paused ? { paddingLeft: 8 } : {},
                    { borderColor: disabledColor },
                ]}>
                    <Icon
                        name={paused ? 'ios-play' : 'ios-pause'}
                        style={styles.play}
                        color={disabledColor}
                    />
                </View>
            );
        }

        return (
            <View style={styles.buttonContainer}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.props.dispatch(toggleShuffle());
                    }}
                >
                    <View style={styles.repeatToggleContainer}>
                        <Icon name="ios-shuffle" size={26}
                            color={this.props.shuffle ? iconColor : inactiveColor}
                            style={this.props.shuffle ? styles.repeatToggleActive : null}
                        />
                    </View>
                </TouchableWithoutFeedback>
                {prevButton}
                {playButton}
                {nextButton}
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.props.dispatch(toggleRepeat());
                    }}
                >
                    <View style={styles.repeatToggleContainer}>
                        <Icon name="ios-repeat" size={26}
                            color={this.props.repeat ? iconColor : inactiveColor}
                            style={this.props.repeat ? styles.repeatToggleActive : null}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    onPressQueueItem(index) {
        this.props.dispatch(setTrack(index));
    }

    renderSongView() {
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                {this.renderCoverflow()}
                {this.renderInfo()}
                {this.renderButtons()}
            </View>
        );
    }

    renderQueue() {
        return (
            <View style={styles.queueListsContainer}>
                <View style={{width: '100%', paddingLeft: 10, paddingRight: 10}}>
                    <Text style={styles.queueHeader}>Now Playing</Text>
                    <NowPlaying
                        song={this.props.playing}
                        style={{ marginBottom: 20 }}
                        loading={this.props.trackLoading}
                    />
                    <Text style={styles.queueHeader}>Play Queue</Text>
                </View>

                <PlayQueue
                    data={this.props.playlist}
                    highlighted={this.props.currentIndex}
                    onPressItem={this.onPressQueueItem.bind(this)}
                />

            </View>
        );
    }

    renderQueueView() {
        return (
            <View style={styles.queueContainer}>
                {this.renderHeader()}
                {this.renderQueue()}
                {this.renderButtons()}
            </View>
        );
    }

    render() {
        if (!this.props.playing) {
            return null;
        }

        if (this.props.player.showQueue) {
            return this.renderQueueView();
        }

        return this.renderSongView();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 48,
        justifyContent: 'space-between',
    },

    queueContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },

    headerButton: {
        width: 40,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    header: {
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
        backgroundColor: 'transparent',
        margin: 16,
        fontSize: 48,
        fontWeight: '800'
    },

    progress: {
        marginLeft: 8,
        marginRight: 8,
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

    queueListsContainer: {
        width: '100%',
        height: D.height - 160,
    },

    queueHeader: {
        color: 'white',
        fontWeight: '900',
        fontSize: 16,
        marginBottom: 20,
    },

    repeatToggleContainer: {
        height: 36,
        width: 36,
        // backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
    },

    repeatToggleActive: {
        fontWeight: '900',
    }
});

const mapStateToProps = (state) => ({
    playing: state.playing.now,
    paused: state.playing.paused,
    trackLoading: state.playing.trackLoading,
    currentIndex: state.playing.currentIndex,
    playlist: state.playing.playlist,
    shuffle: state.playing.shuffle,
    repeat: state.playing.repeat,
    player: state.player,
});

export default Player = connect(mapStateToProps)(PlaylerRenderer);
