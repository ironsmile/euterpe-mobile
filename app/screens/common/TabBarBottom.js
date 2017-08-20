/* @flow */

import React, { PureComponent } from 'react';
import { Animated, TouchableOpacity, StyleSheet } from 'react-native';
import TabBarIcon from 'react-navigation/src/views/TabView/TabBarIcon';
import Footer, { TABBAR_HEIGHT } from './footer';

import type {
  NavigationAction,
  NavigationRoute,
  NavigationState,
  NavigationScreenProp,
  Style,
} from 'react-navigation';

import type { TabScene } from 'react-navigation';

type DefaultProps = {
  activeTintColor: string,
  activeBackgroundColor: string,
  inactiveTintColor: string,
  inactiveBackgroundColor: string,
  showLabel: boolean,
};

type Props = {
  activeTintColor: string,
  activeBackgroundColor: string,
  inactiveTintColor: string,
  inactiveBackgroundColor: string,
  position: Animated.Value,
  navigation: NavigationScreenProp<NavigationState, NavigationAction>,
  jumpToIndex: (index: number) => void,
  getLabel: (scene: TabScene) => ?(React.Element<*> | string),
  renderIcon: (scene: TabScene) => React.Element<*>,
  showLabel: boolean,
  style?: Style,
  labelStyle?: Style,
  showIcon: boolean,
};

export default class TabBarBottom
  extends PureComponent<DefaultProps, Props, void> {
  // See https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/UIKitUICatalog/UITabBar.html
  static defaultProps = {
    activeTintColor: '#3478f6', // Default active tint color in iOS 10
    activeBackgroundColor: 'transparent',
    inactiveTintColor: '#929292', // Default inactive tint color in iOS 10
    inactiveBackgroundColor: 'transparent',
    showLabel: true,
    showIcon: true,
  };

  props: Props;

  _renderLabel = (scene: TabScene) => {
    const {
      position,
      navigation,
      activeTintColor,
      inactiveTintColor,
      labelStyle,
      showLabel,
    } = this.props;
    if (showLabel === false) {
      return null;
    }
    const { index } = scene;
    const { routes } = navigation.state;
    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x: *, i: number) => i)];
    const outputRange = inputRange.map(
      (inputIndex: number) =>
        inputIndex === index ? activeTintColor : inactiveTintColor
    );
    const color = position.interpolate({
      inputRange,
      outputRange,
    });

    const tintColor = scene.focused ? activeTintColor : inactiveTintColor;
    const label = this.props.getLabel({ ...scene, tintColor });
    if (typeof label === 'string') {
      return (
        <Animated.Text style={[styles.label, { color }, labelStyle]}>
          {label}
        </Animated.Text>
      );
    }

    if (typeof label === 'function') {
      return label({ ...scene, tintColor });
    }

    return label;
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.setState({
      translateY: 0,
    })
  }

  _renderIcon = (scene: TabScene) => {
    const {
      position,
      navigation,
      activeTintColor,
      inactiveTintColor,
      renderIcon,
      showIcon,
    } = this.props;
    if (showIcon === false) {
      return null;
    }
    return (
      <TabBarIcon
        position={position}
        navigation={navigation}
        activeTintColor={activeTintColor}
        inactiveTintColor={inactiveTintColor}
        renderIcon={renderIcon}
        scene={scene}
        style={styles.icon}
      />
    );
  };

  _renderFooter = () => {
    return (
      <Footer ref="footer"
          hide={() => {
            this.setFooterTransition();
            Animated.timing(
              this.state.translateY,
              { toValue: TABBAR_HEIGHT }
            ).start();
          }}
          show={() => {
            this.setFooterTransition();
            Animated.timing(
              this.state.translateY,
              { toValue: 0 }
            ).start();
          }}
          hideTabBarNavigation={
            (val) => {
              this.setFooterTransition();
              if (!val) {
                return;
              }
              const yVal = Math.abs((val / 10) - TABBAR_HEIGHT);

              if (this.state && this.state.translateY) {
                this.state.translateY.setValue(yVal);
              }
            }
          }
      />
    );
  }

  componentWillMount = () => {
    this.setFooterTransition();
  }

  setFooterTransition = () => {
    if (!this.state || !this.state.translateY) {
      this.setState({
        translateY: new Animated.Value(0),
      });
    }
  }

  render() {
    const {
      position,
      navigation,
      jumpToIndex,
      activeBackgroundColor,
      inactiveBackgroundColor,
      style,
    } = this.props;
    const { routes, index } = navigation.state;

    let transform = {};
    if (this.state && this.state.translateY !== undefined) {
      transform = {transform: [{translateY: this.state.translateY}]};
    }
    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x: *, i: number) => i)];
    return (
      <Animated.View>
        {this._renderFooter()}
        <Animated.View style={[styles.tabBar, style, transform]}>
          {routes.map((route: NavigationRoute, index: number) => {
            const focused = index === navigation.state.index;
            const scene = { route, index, focused };
            const outputRange = inputRange.map(
              (inputIndex: number) =>
                inputIndex === index
                  ? activeBackgroundColor
                  : inactiveBackgroundColor
            );
            const backgroundColor = position.interpolate({
              inputRange,
              outputRange,
            });
            const justifyContent = this.props.showIcon ? 'flex-end' : 'center';
            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => jumpToIndex(index)}
              >
                <Animated.View
                  style={[styles.tab, { backgroundColor, justifyContent }]}
                >
                  {this._renderIcon(scene)}
                  {this._renderLabel(scene)}
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  tabBar: {
    height: 49, // Default tab bar height in iOS 10
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, .2)',
    backgroundColor: '#f4f4f4', // Default background color in iOS 10
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    width: 56,
  },
  icon: {
    flexGrow: 1,
  },
  label: {
    textAlign: 'center',
    fontSize: 10,
    marginBottom: 1.5,
    backgroundColor: 'transparent',
  },
});
