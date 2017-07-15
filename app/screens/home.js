/**
 * Created by ggoma on 12/23/16.
 */
import React, { Component } from 'react';
import {
    View,
    StyleSheet
} from 'react-native';

import Landing from './Landing';
import Footer from './common/footer';
import TabBarNavigation from './common/tab-bar-navigation';

export class HomeScreen extends Component {

    static navigationOptions = {
      title: 'HOME',
      header: null,
    }

    render() {
        return (
            <View style={styles.container}>
                <Landing />
                <Footer ref='footer'
                        hide={() => this.refs.tab.hide()}
                        show={() => this.refs.tab.show()}
                        hideTabBarNavigation={(v) => this.refs.tab.setHeight(v)}/>
                <TabBarNavigation ref='tab'/>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
