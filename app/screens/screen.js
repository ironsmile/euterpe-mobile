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
import TabBarNavigation from './common/tab-bar-navigation';
import { gs } from '../styles/global';
import { TABBAR_HEIGHT } from './common/footer';

export class Screen extends Component {

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
        let { navigation } = this.props;
        let header = this.props.header;
        if (!header) {
            header = <Header title={this.props.title} />;
        }

        return (
            <View style={[gs.bg, styles.container]}>
                <StatusBar
                    ref='status'
                    translucent
                    animated={true}
                    barStyle={'light-content'}
                    backgroundColor="transparent"
                />
                <View style={styles.children}>
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
                        nowPlaying={{
                            title: "Awseome Track",
                            artist: "Heaviest Metal"
                        }}
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
