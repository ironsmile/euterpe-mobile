import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Screen } from './screen';
import Header from './common/header';

export class AlbumScreen extends React.Component {
    getHeader() {
        return (
            <Header
                title="ALBUM"
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
                        Album screen nananana.
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
