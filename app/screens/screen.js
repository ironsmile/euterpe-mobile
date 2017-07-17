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

export class Screen extends Component {

    componentWillMount() {
        let { navigation } = this.props;
        navigation.setParams({
            translateY: new Animated.Value(0),
        });
    }

    render() {
        let { navigation } = this.props;
        console.log(navigation);
        return (
            <View style={[gs.bg, styles.container]}>
                <StatusBar
                    ref='status'
                    translucent
                    animated={true}
                    barStyle={'light-content'}
                    backgroundColor="transparent"
                />
                {this.props.children}
                <Header title={this.props.title} />
                <Footer ref='footer'
                        hide={() => {
                            Animated.timing(
                                navigation.state.params.translateY,
                                {toValue: 56}
                            ).start();
                        }}
                        show={() => {
                            Animated.timing(
                                navigation.state.params.translateY,
                                {toValue: 0}
                            ).start();
                        }}
                        hideTabBarNavigation={
                            (v) => {
                                if (!v) {
                                    return;
                                }
                                v = Math.abs((v/10) - 56);

                                if (navigation.state.params && navigation.state.params.translateY) {
                                    navigation.state.params.translateY.setValue(v);
                                }
                                // this.refs.tab.setHeight(v);
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
    }
});
