import React, { Component } from 'react';
import {
    Animated,
    View,
    StyleSheet,
    StatusBar
} from 'react-native';

import Landing from './Landing';
import Footer, { TABBAR_HEIGHT } from './common/footer';
import Header from './common/header';
import { gs } from '../styles/global';
import { connect } from 'react-redux';

class ScreenRenderer extends Component {

    componentWillMount() {
        this.setFooterTransition();
    }

    setFooterTransition() {
        const { navigation } = this.props;

        if (!navigation.state.params || !navigation.state.params.translateY) {
            navigation.setParams({
                translateY: new Animated.Value(0),
            });
        }
    }

    renderFooter() {
        const { navigation, nowPlaying } = this.props;

        return (
            <Footer ref="footer"
                    hide={() => {
                        this.setFooterTransition();
                        Animated.timing(
                            navigation.state.params.translateY,
                            { toValue: TABBAR_HEIGHT }
                        ).start();
                    }}
                    show={() => {
                        this.setFooterTransition();
                        Animated.timing(
                            navigation.state.params.translateY,
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

                            if (navigation.state.params && navigation.state.params.translateY) {
                                navigation.state.params.translateY.setValue(yVal);
                            }
                        }
                    }
            />
        );
    }

    render() {
        const { nowPlaying } = this.props;
        let { header } = this.props;

        if (!header) {
            header = <Header title={this.props.title} />;
        }

        const footerHeight = nowPlaying.now ? TABBAR_HEIGHT : 0;

        return (
            <View style={[gs.bg, styles.container]}>
                <StatusBar
                    ref="status"
                    translucent
                    animated={true}
                    barStyle={'light-content'}
                    backgroundColor="transparent"
                />
                <View style={[styles.children, { marginBottom: footerHeight }]}>
                    {this.props.children}
                </View>
                {header}
                {this.renderFooter()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    children: {
        marginBottom: TABBAR_HEIGHT,
        flex: 1,
    }
});

const mapStateToProps = (state) => ({
    nowPlaying: state.playing,
});

export const Screen = connect(mapStateToProps)(ScreenRenderer);
