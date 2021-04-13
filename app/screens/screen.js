import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    StatusBar
} from 'react-native';

import Footer, { TOGETHER, TABBAR_HEIGHT } from './common/footer';
import Header from './common/header';
import { gs } from '../styles/global';
import { connect } from 'react-redux';
import D from '@screens/common/dimensions';

class ScreenRenderer extends Component {
    render() {
        const { nowPlaying } = this.props;
        let { header } = this.props;

        if (!header && !this.props.noHeader) {
            header = <Header title={this.props.title} />;
        }
        const screenHeight = { height: D.height };

        return (
            <View style={[gs.bg, styles.backgroundView]}>
                <View style={[
                    styles.container,
                    screenHeight,
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
