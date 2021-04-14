import React, { Component } from 'react';
import {
  Animated,
  PanResponder,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  BackHandler,
} from 'react-native';

import D from './dimensions';

import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { showFooter } from '@actions/footer';
import { togglePlaying } from '@actions/playing';
import { TrackProgress } from '@components/track-progress';
import { PlatformIcon } from '@components/platform-icon';
import Player from './player';
import { gs } from '@styles/global';

export const FOOTER_HEIGHT = 38;
export const TABBAR_HEIGHT = 56;
export const TOGETHER = FOOTER_HEIGHT + TABBAR_HEIGHT;

class FooterRenderer extends Component {
  state = {
    pan: new Animated.ValueXY(),
    opacity: new Animated.Value(1),
  };

  moving = false;
  open = false;
  hiding = false;
  offY = D.height - TOGETHER;

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.open) {
        this.scrollDown();
        return true;
      }
      return false;
    });
  }

  // hide is called when the player modal is hidden.
  hide() {
    this.props.dispatch(showFooter(true));
  }

  // show is called when the player modal is shown.
  show() {
    this.props.dispatch(showFooter(false));
  }

  panResponderEnabled() {
    return !this.open || !this.props.playerQueueShown;
  }

  componentWillMount() {
    let panMover = Animated.event([
      null,
      {
        dy: this.state.pan.y,
      },
    ]);
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (e, g) => !(g.dx === 0 || g.dy === 0),
      onPanResponderTerminationRequest: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: () => false,

      onPanResponderGrant: (e, gestureState) => {},

      onPanResponderMove: (e, g) => {
        if (!this.panResponderEnabled()) {
          return;
        }

        if (this.moving || (!this.open && g.dy > 0) || (this.open && g.dy < 0)) {
          // console.log('shouldnt move!!');
          return;
        }

        if (!this.open && g.dy < 0) {
          const value = g.dy / 70 + 1;
          if (value > 0 && value < 1) {
            this.state.opacity.setValue(value);
          }
        }

        if (this.open && g.dy > 0) {
          const value = g.dy / 250 - 1;
          if (value > 0 && value < 1) {
            this.state.opacity.setValue(value);
          }
        }

        return panMover(e, g);
      },
      onPanResponderRelease: (e, g) => {
        if (!this.panResponderEnabled()) {
          return;
        }

        if (this.moving || (!this.open && g.dy > 0) || (this.open && g.dy < 0)) {
          // console.log('shouldnt release');
          return;
        } else {
          const offsetY = g.dy;
          // console.log(offsetY);

          if (!this.open) {
            /*
                            If you are swiping up quickly and your finger goes off the screen,
                            the View doesn't always open fully (it stops a few px from the top).
                            This sort of thing happens because the event system couldn't keep up
                            with the fast swipe, and the last event it gets is from a few
                            milliseconds before it hit the top.
                            You can fix this by always fully opening the View when its `y` is
                            within some distance from the top. I think you can just add
                            `if (g.y0 <= 100) this.scrollUp();` in your `onPanResponderRelease`
                         */
            if (g.y0 >= 100) {
              this.openPlaying(offsetY);
            }
          } else {
            this.closePlaying(offsetY);
          }
        }
      },
    });
  }

  openPlaying(offsetY) {
    if (offsetY < -100) {
      // console.log('open');
      this.moving = true;
      this.hide();
      StatusBar.setHidden(true, true);
      this.state.opacity.setValue(0);
      Animated.timing(this.state.pan.y, {
        toValue: -D.height + TOGETHER,
        duration: 200,
      }).start(() => {
        // console.log('opened');
        //hide tab bar

        setTimeout(() => {
          this.open = true;
          this.moving = false;
        }, 200);
        this.state.pan.setOffset({ y: -D.height + TOGETHER });
        this.state.pan.setValue({ y: 0 });
      });
    } else {
      this.moving = true;
      this.reset();
      // console.log('back to original state 1!', this.state.pan.y);
      this.show();
      Animated.timing(this.state.pan.y, { toValue: 0 }).start(() => {
        setTimeout(() => (this.moving = false), 200);
        this.state.pan.setOffset({ y: 0 });
      });
    }
  }

  closePlaying(offsetY) {
    if (offsetY > 100) {
      // console.log('closing');
      this.reset();
      this.moving = true;
      this.show();
      StatusBar.setHidden(false, true);
      Animated.timing(this.state.pan.y, { toValue: D.height - TOGETHER, duration: 200 }).start(
        () => {
          // console.log('closed');
          setTimeout(() => {
            this.open = false;
            this.moving = false;
          }, 200);
          this.state.pan.setOffset({ y: 0 });
          this.state.pan.setValue({ y: 0 });
        }
      );
    } else {
      this.moving = true;
      // console.log('back to original state 2!');
      this.hide();
      Animated.timing(this.state.pan.y, { toValue: 0 }).start(() => {
        setTimeout(() => (this.moving = false), 200);
        this.state.pan.setOffset({ y: -D.height + TOGETHER });
      });
    }
  }

  scrollUp() {
    Animated.spring(this.state.opacity, { toValue: 0 }).start();
    this.openPlaying(-101);
  }

  scrollDown() {
    Animated.spring(this.state.opacity, { toValue: 1 }).start();
    this.closePlaying(101);
  }

  reset() {
    Animated.spring(this.state.opacity, { toValue: 1 }).start();
  }

  getStyle() {
    return {
      transform: [
        {
          translateY: this.state.pan.y,
        },
      ],
    };
  }

  renderDefault() {
    const { opacity } = this.state;
    const { nowPlaying } = this.props;

    if (!nowPlaying) {
      return null;
    }

    return (
      <Animated.View
        style={[
          styles.firstView,
          {
            opacity,
            height: opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0, FOOTER_HEIGHT],
            }),
          },
        ]}
      >
        <View style={styles.defaultContainer}>
          <TrackProgress height={4} style={{ width: '100%' }} />
          <View style={styles.defaultView}>
            <TouchableOpacity onPress={() => this.scrollUp()}>
              <View style={styles.pullUpArrow}>
                <Icon name="ios-arrow-up" color="#aeafb3" size={16} />
              </View>
            </TouchableOpacity>
            <TouchableWithoutFeedback onPress={() => this.scrollUp()}>
              <View style={styles.nowPlayingContainer}>
                <Text style={[gs.bolder, styles.title]} numberOfLines={1}>
                  {nowPlaying.title}
                </Text>
                <Text style={styles.albumDivider}>·</Text>
                <Text style={[gs.bolder, styles.author]} numberOfLines={1}>
                  {nowPlaying.artist}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            {this.renderControlButton()}
          </View>
        </View>
      </Animated.View>
    );
  }

  renderControlButton() {
    if (this.props.trackLoading) {
      return (
        <View style={styles.pauseButton}>
          <ActivityIndicator color="white" />
        </View>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => {
          this.props.dispatch(togglePlaying());
        }}
      >
        <View style={styles.pauseButton}>
          <View style={styles.pause}>
            <PlatformIcon platform={this.props.paused ? 'play' : 'pause'} color="white" size={16} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const height = this.props.nowPlaying ? TOGETHER : FOOTER_HEIGHT;

    return (
      <View ref="view" style={[styles.container, { height: height }]}>
        <Animated.View
          {...this._panResponder.panHandlers}
          style={[styles.playing, this.getStyle()]}
        >
          <Player scrollDown={() => this.scrollDown()} />
          {this.renderDefault()}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: D.width,
    // top: D.height-TOGETHER,
    bottom: 0,
  },
  defaultContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  defaultView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  playing: {
    backgroundColor: 'rgba(0,0,0,.95)',
    height: D.height,
  },
  firstView: {
    position: 'absolute',
    top: 0,
    height: FOOTER_HEIGHT,
    width: D.width,
    backgroundColor: '#222327',
    // borderTopColor: '#3c3d41',
    // borderTopWidth: 4,
  },
  pause: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },

  pauseButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 12,
    color: 'white',
  },

  author: {
    fontSize: 12,
    color: '#aeafb3',
  },

  music: {
    fontWeight: '300',
    color: '#40bf7c',
    fontSize: 12,
  },

  albumDivider: {
    marginLeft: 3,
    marginRight: 3,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },

  pullUpArrow: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  nowPlayingContainer: {
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: D.width - 72,
  },
});

const mapStateToProps = (state) => ({
  nowPlaying: state.playing.now,
  paused: state.playing.paused,
  trackLoading: state.playing.trackLoading,
  playerQueueShown: state.player.showQueue,
});

const Footer = connect(mapStateToProps)(FooterRenderer);
export default Footer;
