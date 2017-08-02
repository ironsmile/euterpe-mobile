/**
 * Created by ggoma on 12/23/16.
 */
import React from 'react';
import Landing from './Landing';
import { Screen } from './screen';
import { CreateTabIcon, CreateTabLabel } from './common/tab-bar';

export class HomeScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: CreateTabLabel('Home'),
        tabBarIcon: CreateTabIcon('ios-home'),
    });

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.navigation.state.key == "Home";
    }

    render() {
        return (
            <Screen
                title='HOME'
                navigation={this.props.navigation}
            >
                <Landing />
            </Screen>
        )
    }
}
