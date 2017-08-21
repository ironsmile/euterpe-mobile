import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

import { CreateTabIcon, CreateTabLabel } from './common/tab-bar';
import { Screen } from '@screens/screen';
import { Helpful } from '@components/helpful';

export class BrowseScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: CreateTabLabel('Browse'),
        tabBarIcon: CreateTabIcon('ios-albums'),
    });

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.navigation.state.key == "Browse";
    }

    render() {
        return (
            <Screen
                title='BROWSE'
                navigation={this.props.navigation}
            >
                <Helpful
                    iconName="alert"
                    title="Unsupported"
                    firstLine="The HTTPMS server doesn't support browsing."
                    secondLine="Upgrade it to the latest version."
                />
            </Screen>
        )
    }
}
