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
import TabBarNavigation from './common/tab-bar-navigation';
import { gs } from '../styles/global';

export class Screen extends Component {

    componentWillMount() {
        this.props.navigation.setParams({
            titleText: this.props.title
        });
    }

    hideHeader() {
        this.props.navigation.setParams({ 
            header: null 
        });
    }

    showHeader() {
        this.props.navigation.setParams({ 
            header: undefined 
        });
    }

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
                <Footer ref='footer'
                        hide={() => {
                            this.refs.tab.hide();
                            this.hideHeader();
                        }}
                        show={() => {
                            this.refs.tab.show();
                            this.showHeader();
                        }}
                        hideTabBarNavigation={
                            (v) => {
                                if (!v) {
                                    return;
                                }
                                this.refs.tab.setHeight(v);
                            }
                        }
                />
                <TabBarNavigation ref='tab'/>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
