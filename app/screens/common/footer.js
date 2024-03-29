import React, { PureComponent } from 'react';
import {
  Animated,
  PanResponder,
  View,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  BackHandler,
  Keyboard,
} from 'react-native';

import D from './dimensions';

import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { showPlayerFullscreen } from '@actions/footer';
import { togglePlaying } from '@actions/playing';
import { TrackProgress } from '@components/track-progress';
import { PlatformIcon } from '@components/platform-icon';
import { Pressable } from '@components/pressable';
import Player from './player';
import { gs } from '@styles/global';

export const FOOTER_HEIGHT = 38;
export const TABBAR_HEIGHT = 56;
export const TOGETHER = FOOTER_HEIGHT + TABBAR_HEIGHT;
const ANIMATION_DURATION = 400;

class FooterRenderer extends PureComponent {
  moving = false;
  open = false;
  hiding = false;

  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      opacity: new Animated.Value(1),
      keyboardShown: false,
    };

    let panMover = Animated.event(
      [
        null,
        {
          dy: this.state.pan.y,
        },
      ],
      { useNativeDriver: false }
    );
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, g) => {
        return this.panResponderEnabled(g);
      },
      onMoveShouldSetPanResponder: (e, g) => {
        return this.panResponderEnabled(g);
      },
      onPanResponderTerminationRequest: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: () => false,

      onPanResponderGrant: (e, gestureState) => {},
      onPanResponderMove: (e, g) => {
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

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.open) {
        this.scrollDown();
        return true;
      }
      return false;
    });

    if (this.props.playerFullScreen) {
      //!TODO: make sure the player is up without any animation. The
      // scrollUp function actually animates the player card going up
      // which makes the screen flicker.
      this.scrollUp();
    }

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide.bind(this)
    );
  }

  componentWillUnmount() {
    if (this.keyboardDidShowListener) {
      this.keyboardDidShowListener.remove();
      this.keyboardDidShowListener = null;
    }

    if (this.keyboardDidHideListener) {
      this.keyboardDidHideListener.remove();
      this.keyboardDidHideListener = null;
    }
  }

  _keyboardDidShow() {
    this.setState({
      keyboardShown: true,
    });
  }

  _keyboardDidHide() {
    this.setState({
      keyboardShown: false,
    });
  }

  // hide is called when the player modal is hidden.
  hide() {
    this.props.dispatch(showPlayerFullscreen(true));
  }

  // show is called when the player modal is shown.
  show() {
    this.props.dispatch(showPlayerFullscreen(false));
  }

  panResponderEnabled(g) {
    // Somehow when the player is open and moveY is above zero it means that the pan
    // gesture is started from above some pressable on the screen. When it is zero
    // then it was on "empty" screen. THIS IS NOT DOCUMENTED BEHAVIOUR. But so far
    // this has been the case in my tests so sticking with this as long as it works.
    if (this.open && g.moveY > 0) {
      return false;
    }

    // When only the small player info above the footer is shown then do not start
    // the pan movement when it is above the buttons. Which are to the far left and
    // far right of the screen.
    if (!this.open && (g.moveX < 50 || g.moveX > D.width - 50)) {
      return false;
    }

    return true;
  }

  openPlaying(offsetY) {
    this.moving = true;
    if (offsetY < -100) {
      // console.log('open');
      this.hide();
      StatusBar.setHidden(true, true);
      this.state.opacity.setValue(0);
      Animated.timing(this.state.pan.y, {
        toValue: -D.height + TOGETHER,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(({ finished }) => {
        // console.log('opened');
        //hide tab bar
        this.open = true;
        this.moving = false;

        this.state.pan.setOffset({ y: -D.height + TOGETHER });
        this.state.pan.setValue({ y: 0, x: 0 });
      });
    } else {
      this.reset();
      // console.log('back to original state 1!', this.state.pan.y);
      this.show();
      Animated.timing(this.state.pan.y, { toValue: 0, useNativeDriver: true }).start(() => {
        this.moving = false;
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
      Animated.timing(this.state.pan.y, {
        toValue: D.height - TOGETHER,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(() => {
        // console.log('closed');
        this.open = false;
        this.moving = false;
        this.state.pan.setOffset({ y: 0 });
        this.state.pan.setValue({ y: 0, x: 0 });
      });
    } else {
      this.moving = true;
      // console.log('back to original state 2!');
      this.hide();
      Animated.timing(this.state.pan.y, { toValue: 0, useNativeDriver: true }).start(() => {
        this.moving = false;
        this.state.pan.setOffset({ y: TOGETHER - D.height });
      });
    }
  }

  scrollUp() {
    if (this.open) {
      return;
    }

    Animated.spring(this.state.opacity, {
      duration: ANIMATION_DURATION,
      toValue: 0,
      useNativeDriver: false,
    }).start();
    this.openPlaying(-101);
  }

  scrollDown() {
    Animated.spring(this.state.opacity, {
      duration: ANIMATION_DURATION,
      toValue: 1,
      useNativeDriver: false,
    }).start();
    this.closePlaying(101);
  }

  reset() {
    Animated.spring(this.state.opacity, {
      duration: ANIMATION_DURATION,
      toValue: 1,
      useNativeDriver: false,
    }).start();
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
    const { nowPlaying, playerFullScreen } = this.props;

    if (!nowPlaying || playerFullScreen) {
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
            <Pressable onPress={() => this.scrollUp()}>
              <View style={styles.pullUpArrow}>
                <Icon name="ios-arrow-up" color="#aeafb3" size={16} />
              </View>
            </Pressable>
            <Pressable onPress={() => this.scrollUp()}>
              <View style={styles.nowPlayingContainer}>
                <Text style={[gs.bolder, styles.title]} numberOfLines={1}>
                  {nowPlaying.title}
                </Text>
                <Text style={styles.albumDivider}>·</Text>
                <Text style={[gs.bolder, styles.author]} numberOfLines={1}>
                  {nowPlaying.artist}
                </Text>
              </View>
            </Pressable>
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
          <ActivityIndicator color={gs.font.color} />
        </View>
      );
    }

    return (
      <Pressable
        onPress={() => {
          this.props.dispatch(togglePlaying());
        }}
      >
        <View style={styles.pauseButton}>
          <View style={styles.pause}>
            <PlatformIcon platform={this.props.paused ? 'play' : 'pause'} color="white" size={16} />
          </View>
        </View>
      </Pressable>
    );
  }

  render() {
    if (this.state.keyboardShown === true) {
      return null;
    }

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
  playerFullScreen: state.footer.playerFullScreen,
});

const Footer = connect(mapStateToProps)(FooterRenderer);
export default Footer;
