import React, { PureComponent } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';

import { TOGETHER, TABBAR_HEIGHT } from './common/footer';
import Header from './common/header';
import { gs } from '../styles/global';
import { connect } from 'react-redux';
import D from '@screens/common/dimensions';

class ScreenRenderer extends PureComponent {
  render() {
    let { header } = this.props;
    const { nowPlaying } = this.props;

    if (!header && !this.props.noHeader) {
      header = <Header title={this.props.title} />;
    }
    const footerHeight = nowPlaying.now ? TOGETHER : TABBAR_HEIGHT;
    let screenHeight = { height: D.height - footerHeight };

    if (this.props.noTabBar) {
      screenHeight = { height: D.height };
    }

    return (
      <View style={[gs.bg, styles.backgroundView]}>
        <View style={[styles.container, screenHeight]}>
          <StatusBar
            ref="status"
            translucent
            animated={true}
            barStyle={'light-content'}
            backgroundColor="transparent"
          />
          <View style={[styles.children]}>{this.props.children}</View>
          {header}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundView: {
    height: '100%',
  },
  container: {
    flexDirection: 'column',
  },
  children: {
    flex: 1,
  },
});

const mapStateToProps = (state) => ({
  nowPlaying: state.playing,
});

export const Screen = connect(mapStateToProps)(ScreenRenderer);
