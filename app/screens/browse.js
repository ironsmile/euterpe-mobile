/**
 * Created by ggoma on 12/23/16.
 */
import React from 'react';
import { Text } from 'react-native';
import { Screen } from './screen';
import { CreateTabIcon, CreateTabLabel } from './common/tab-bar';

export class BrowseScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: CreateTabLabel('Browse'),
        tabBarIcon: CreateTabIcon('ios-albums'),
    });

    render() {
        return (
            <Screen
                title='BROWSE'
                navigation={this.props.navigation}
            >
                <Text style={{color: 'white', marginTop: 50}}>Browse Screen</Text>
            </Screen>
        )
    }
}
