/**
 * Created by ggoma on 12/23/16.
 */
import React from 'react';
import { Text } from 'react-native';
import { Screen } from './screen';
import { CreateTabIcon, CreateTabLabel } from './common/tab-bar';

export class AboutScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: CreateTabLabel('About'),
        tabBarIcon: CreateTabIcon('ios-information-circle'),
    });

    render() {
        return (
            <Screen
                title='ABOUT'
                navigation={this.props.navigation}
            >
                <Text style={{color: 'white', marginTop: 50}}>About Screen</Text>
            </Screen>
        )
    }
}
