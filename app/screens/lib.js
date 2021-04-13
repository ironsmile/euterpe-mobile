import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from './screen';
import { Settings } from './settings';

export class LibraryScreen extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.route.key === 'Library';
  }

  render() {
    return (
      <Screen title="LIBRARY" navigation={this.props.navigation}>
        <View style={styles.container}>
          <Settings navigation={this.props.navigation} />
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
  text: {
    color: 'white',
    marginTop: 50,
    textAlign: 'center',
  },
});
