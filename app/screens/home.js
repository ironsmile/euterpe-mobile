import React from 'react';
import Landing from './Landing';
import { Screen } from './screen';

export class HomeScreen extends React.Component {
    render() {
        return (
            <Screen
                title="HOME"
                navigation={this.props.navigation}
            >
                <Landing />
            </Screen>
        );
    }
}
