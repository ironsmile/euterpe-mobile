import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Share,
} from 'react-native';

import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  togglePlaying,
  toggleShuffle,
  toggleRepeat,
  setTrack,
  previousSongInQueue,
  nextSongInQueue,
  seekToSeconds,
} from '@actions/playing';
import { togglePlayerViewState } from '@actions/player';
import D from './dimensions';
import CoverFlowItem from './coverflow-item';
import { TimedProgress, TrackProgress } from '@components/track-progress';
import Images from '@assets/images';
import MediaControl from '@components/media-control-shim';
import { NowPlaying } from '@components/now-playing-small';
import { SongsList } from '@components/songs-list';
import { PlatformIcon } from '@components/platform-icon';
import { httpms } from '@components/httpms-service';
import { appendError } from '@actions/errors';

class PlayerRenderer extends React.PureComponent {
  componentDidMount() {
    MediaControl.on('play', () => {
      this.onTogglePlay(true);
    });

    MediaControl.on('pause', () => {
      this.onTogglePlay(false);
    });

    MediaControl.on('nextTrack', () => {
      this.onNextSong();
    });

    MediaControl.on('previousTrack', () => {
      this.onPreviousSong();
    });

    MediaControl.on('seekForward', () => {});

    MediaControl.on('seekBackward', () => {});

    MediaControl.on('seek', (pos) => {
      // pos is in seconds
      this.onSeekTo(pos);
    });
  }

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

  onSeekTo(pos) {
    this.props.dispatch(seekToSeconds(pos));
  }

  toggleViewState() {
    this.props.dispatch(togglePlayerViewState());
  }

  renderHeader() {
    const stateIcon = this.props.player.showQueue ? 'list-circle' : 'list-circle-outline';

    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => this.props.scrollDown()}>
          <View style={styles.headerButton}>
            <Icon name="ios-arrow-down" color="white" size={24} />
          </View>
        </TouchableOpacity>
        <Text style={styles.playing}>NOW PLAYING</Text>
        <TouchableOpacity onPress={this.toggleViewState.bind(this)}>
          <View style={styles.headerButton}>
            <Icon name={stateIcon} color="white" size={26} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderCoverflow() {
    const height = (D.width * 3.2) / 5;
    const width = (D.width * 3.2) / 5;
    const { playing } = this.props;

    return (
      <CoverFlowItem
        page_width={D.width}
        width={width}
        height={height}
        defaultSource={Images.unknownAlbum}
        source={{ uri: httpms.getAlbumArtworkURL(playing.album_id) }}
      />
    );
  }

  renderInfo() {
    const { playing, trackLoading, dispatch } = this.props;

    return (
      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <View style={styles.smallButtonContainer}>
            <PlatformIcon platform="add" color="white" size={24} />
          </View>
          <View style={styles.titleTextContainer}>
            <Text numberOfLines={1} style={styles.title}>
              {playing.title}
            </Text>
            <Text numberOfLines={1} style={styles.artist}>
              {playing.artist}
            </Text>
          </View>
          <View style={styles.smallButtonContainer}>
            <TouchableOpacity
              onPress={() => {
                Share.share({
                  message: `${playing.title} by ${playing.artist}\n${httpms.getShareURL(playing)}`,
                  title: 'Share this song',
                }).catch((error) => {
                  // ignored
                  dispatch(appendError(`Error happened while sharing: ${error}`));
                });
              }}
            >
              <PlatformIcon platform="share" color="white" size={24} />
            </TouchableOpacity>
          </View>
        </View>
        <TimedProgress style={styles.progress} loading={trackLoading} />
      </View>
    );
  }

  renderButtons() {
    const { paused, trackLoading, playlist, currentIndex } = this.props;
    const inactiveColor = '#5a6060';
    const disabledColor = '#5a6060';
    const iconColor = 'white';

    let prevButton = (
      <TouchableOpacity onPress={this.onPreviousSong.bind(this)}>
        <PlatformIcon platform="play-skip-back" size={32} color={iconColor} />
      </TouchableOpacity>
    );

    if (currentIndex - 1 < 0 || !playlist[currentIndex - 1] || trackLoading) {
      prevButton = <PlatformIcon platform="play-skip-back" size={32} color={disabledColor} />;
    }

    let nextButton = (
      <TouchableOpacity onPress={this.onNextSong.bind(this)}>
        <PlatformIcon platform="play-skip-forward" size={32} color={iconColor} />
      </TouchableOpacity>
    );

    if (
      (!playlist[currentIndex + 1] && !this.props.shuffle && !this.props.repeat) ||
      trackLoading
    ) {
      nextButton = <PlatformIcon platform="play-skip-forward" size={32} color={disabledColor} />;
    }

    let playButton = (
      <TouchableOpacity
        onPress={() => {
          this.onTogglePlay();
        }}
        style={styles.playContainer}
      >
        <PlatformIcon platform={paused ? 'play' : 'pause'} style={styles.play} color={iconColor} />
      </TouchableOpacity>
    );

    if (trackLoading) {
      playButton = (
        <View style={styles.playContainer}>
          <PlatformIcon
            platform={paused ? 'play' : 'pause'}
            style={styles.play}
            color={disabledColor}
          />
        </View>
      );
    }

    const repeatIconName = this.props.repeatSong ? 'sync' : 'repeat';

    return (
      <View style={styles.buttonContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.dispatch(toggleShuffle());
          }}
        >
          <View style={styles.smallButtonContainer}>
            <PlatformIcon
              platform="shuffle"
              size={26}
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
          <View style={styles.smallButtonContainer}>
            <PlatformIcon
              platform={repeatIconName}
              size={26}
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
        <View style={styles.queueNowPlaying}>
          <Text style={styles.queueHeader}>Now Playing</Text>
          <NowPlaying
            song={this.props.playing}
            style={{ marginBottom: 5 }}
            loading={this.props.trackLoading}
          />
          <TrackProgress style={{ marginBottom: 13 }} />
          <Text style={styles.queueHeader}>Play Queue</Text>
        </View>

        <SongsList
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

const playerButtonSize = 36;

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
    marginBottom: 12,
  },

  infoContainer: {},

  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 32,
  },

  titleTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    width: D.width - playerButtonSize * 2,
  },

  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },

  artist: {
    color: 'white',
    fontSize: 14,
    fontWeight: '400',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
  },

  playContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: 'white',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  play: {
    backgroundColor: 'transparent',
    margin: 16,
    fontSize: 48,
    fontWeight: '800',
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
    fontWeight: '300',
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

  smallButtonContainer: {
    height: playerButtonSize,
    width: playerButtonSize,
    justifyContent: 'center',
    alignItems: 'center',
  },

  repeatToggleActive: {
    fontWeight: '900',
  },

  queueNowPlaying: {
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
  },
});

const mapStateToProps = (state) => ({
  playing: state.playing.now,
  paused: state.playing.paused,
  trackLoading: state.playing.trackLoading,
  currentIndex: state.playing.currentIndex,
  playlist: state.playing.playlist,
  shuffle: state.playing.shuffle,
  repeat: state.playing.repeat,
  repeatSong: state.playing.repeatSong,
  player: state.player,
});

const Player = connect(mapStateToProps)(PlayerRenderer);
export default Player;
