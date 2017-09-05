import React from 'react';

import { Screen } from '@screens/screen';
import { Helpful } from '@components/helpful';
import Header from '@screens/common/header';

export class BrowseSongsScreen extends React.Component {

    getHeader() {
        return (
            <Header
                title="BROWSE SONGS"
                onBackButton={() => {
                    this.props.navigation.goBack();
                }}
            />
        );
    }

    render() {
        return (
            <Screen
                header={this.getHeader()}
                navigation={this.props.navigation}
            >
                <Helpful
                    iconName="alert"
                    title="Unsupported"
                    firstLine="The server doesn't support browsing songs."
                    secondLine="Upgrade it to the latest version."
                />
            </Screen>
        );
    }

}
