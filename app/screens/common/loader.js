import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from '@components/activity-indicator';

export class Loader extends React.PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
