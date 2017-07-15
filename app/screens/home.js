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
import { gs, hs } from '../styles/global';

export class HomeScreen extends Component {

    static navigationOptions = {
      title: 'HOME',
      headerStyle: hs.bg,
      headerTitleStyle: hs.font,
    }

    render() {
        return (
            <View style={[gs.bg, styles.container]}>
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
        flex: 1,
    }
});
