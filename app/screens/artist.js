import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

import { Screen } from '@screens/screen';
import Header from '@screens/common/header';

export class ArtistScreen extends React.Component {
    getHeader() {
        return (
            <Header
                title="ARTIST"
                onBackButton={() => {
                    this.props.navigation.goBack();
                }}
            />
        );
    }

    render() {
        return (
            <Screen
                navigation={this.props.navigation}
                header={this.getHeader()}
            >
                <View style={styles.container}>
                    <Text style={styles.explainText}>
                        !TODO: create an artist screen
                    </Text>
                </View>
            </Screen>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  explainText: {
    color: 'white',
    marginTop: 50,
    textAlign: 'center',
  },
});
