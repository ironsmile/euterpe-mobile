import React, { Component } from 'react';
import {
    Animated,
    View,
    StyleSheet,
    StatusBar
} from 'react-native';

import Landing from './Landing';
import { TOGETHER, TABBAR_HEIGHT } from './common/footer';
import Header from './common/header';
import { gs } from '../styles/global';
import { connect } from 'react-redux';
import D from '@screens/common/dimensions';

class ScreenRenderer extends Component {
    render() {
        const { nowPlaying } = this.props;
        let { header } = this.props;

        if (!header) {
            header = <Header title={this.props.title} />;
        }

        const footerHeight = nowPlaying.now ? TOGETHER : TABBAR_HEIGHT;

        return (
            <View style={[
                gs.bg,
                styles.container,
                { height: D.height - footerHeight }
            ]}>
                <StatusBar
                    ref="status"
                    translucent
                    animated={true}
                    barStyle={'light-content'}
                    backgroundColor="transparent"
                />
                <View style={[styles.children]}>
                    {this.props.children}
                </View>
                {header}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    children: {
        flex: 1,
    }
});

const mapStateToProps = (state) => ({
    nowPlaying: state.playing,
});

export const Screen = connect(mapStateToProps)(ScreenRenderer);
