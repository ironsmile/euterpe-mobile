/**
 * Created by ggoma on 12/23/16.
 */
import React, { Component } from 'react';
import {
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
    render() {
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
                            return;
                            this.refs.tab.hide();
                        }}
                        show={() => {
                            return;
                            this.refs.tab.show();
                        }}
                        hideTabBarNavigation={
                            (v) => {
                                if (!v) {
                                    return;
                                }
                                let { navigation } = this.props;
                                navigation.setParams({
                                    forcedHeight: v,
                                });
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
