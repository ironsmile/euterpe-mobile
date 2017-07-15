/**
 * Created by ggoma on 12/23/16.
 */
import React from 'react';
import Landing from './Landing';
import { Screen } from './screen';

export class HomeScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        header: navigation.state.params ? navigation.state.params.header : undefined,
        title: navigation.state.params ? navigation.state.params.titleText : undefined,
    });

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
