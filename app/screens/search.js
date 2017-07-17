/**
 * Created by ggoma on 12/23/16.
 */
import React from 'react';
import { Text } from 'react-native';
import { Screen } from './screen';
import { CreateTabIcon, CreateTabLabel } from './common/tab-bar';

export class SearchScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: CreateTabLabel('Search'),
        tabBarIcon: CreateTabIcon('ios-search'),
    });

    render() {
        return (
            <Screen
                title='SEARCH'
                navigation={this.props.navigation}
            >
                <Text style={{color: 'white', marginTop: 50}}>Search Screen</Text>
            </Screen>
        )
    }
}
