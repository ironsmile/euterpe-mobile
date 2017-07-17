/**
 * Created by ggoma on 12/23/16.
 */
import React from 'react';
import { Text } from 'react-native';
import { Screen } from './screen';
import { CreateTabIcon, CreateTabLabel } from './common/tab-bar';

export class LibraryScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: CreateTabLabel('Library'),
        tabBarIcon: CreateTabIcon('ios-book'),
    });

    render() {
        return (
            <Screen
                title='LIBRARY'
                navigation={this.props.navigation}
            >
                <Text style={{color: 'white', marginTop: 50}}>Library Screen</Text>
            </Screen>
        )
    }
}
