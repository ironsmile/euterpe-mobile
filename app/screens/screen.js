/**
 * Created by ggoma on 12/23/16.
 */
import React, { Component } from 'react';
import {
    Animated,
    View,
    StyleSheet,
    StatusBar
} from 'react-native';

import Landing from './Landing';
import Footer from './common/footer';
import Header from './common/header';
import { gs } from '../styles/global';
import { TABBAR_HEIGHT } from './common/footer';
import { connect } from 'react-redux';

class ScreenRenderer extends Component {

    componentWillMount() {
        this.setFooterTransition();
    }

    setFooterTransition() {
        let { navigation } = this.props;
        if (!navigation.state.params || !navigation.state.params.translateY) {
            navigation.setParams({
                translateY: new Animated.Value(0),
            });
        }       
    }

    render() {
        let { navigation, nowPlaying } = this.props;
        let header = this.props.header;
        if (!header) {
            header = <Header title={this.props.title} />;
        }

        let footerHeight = (nowPlaying.now) ? TABBAR_HEIGHT : 0;

        return (
            <View style={[gs.bg, styles.container]}>
                <StatusBar
                    ref='status'
                    translucent
                    animated={true}
                    barStyle={'light-content'}
                    backgroundColor="transparent"
                />
                <View style={[styles.children, {marginBottom: footerHeight}]}>
                    {this.props.children}
                </View>
                {header}
                <Footer ref='footer'
                        hide={() => {
                            this.setFooterTransition();
                            Animated.timing(
                                navigation.state.params.translateY,
                                {toValue: TABBAR_HEIGHT}
                            ).start();
                        }}
                        show={() => {
                            this.setFooterTransition();
                            Animated.timing(
                                navigation.state.params.translateY,
                                {toValue: 0}
                            ).start();
                        }}
                        hideTabBarNavigation={
                            (v) => {
                                this.setFooterTransition();
                                if (!v) {
                                    return;
                                }
                                v = Math.abs((v/10) - TABBAR_HEIGHT);

                                if (navigation.state.params && navigation.state.params.translateY) {
                                    navigation.state.params.translateY.setValue(v);
                                }
                            }
                        }
                />
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    children: {
        marginBottom: TABBAR_HEIGHT,
        flex: 1,
    }
});

const mapStateToProps = (state) => ({
    nowPlaying: state.playing
});

export const Screen = connect(mapStateToProps)(ScreenRenderer);
