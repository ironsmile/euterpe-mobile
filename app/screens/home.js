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

    static navigationOptions = ({ navigation }) => ({
        header: navigation.state.params ? navigation.state.params.header : undefined,
        title: 'HOME',
        headerStyle: hs.bg,
        headerTitleStyle: {...hs.font, alignSelf: 'center'},
    });

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
                <Landing />
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
