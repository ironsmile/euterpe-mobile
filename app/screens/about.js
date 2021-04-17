import React from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import { Screen } from '@screens/screen';
import { version } from '../../package.json';

export class AboutScreen extends React.PureComponent {
  render() {
    return (
      <Screen title="ABOUT" navigation={this.props.navigation}>
        <ScrollView>
          <View style={styles.container}>
            <Text style={[styles.text, styles.header]}>HTTPMS Mobile Player</Text>

            <Text style={styles.text}>Version: {version}</Text>

            <Text style={[styles.text, styles.header]}>OpenSource projects used in this app:</Text>

            <Credits />

            <Text style={[styles.text, styles.thankyou]}>
              Thank you all for your hard work which made this app possible!
            </Text>
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

function Credits() {
  return (
    <View>
      <Text style={styles.text}>react-native-keyboard-spacer (^0.4.1)</Text>
      <Text style={styles.text}>react-native-progress (^4.1.2)</Text>
      <Text style={styles.text}>react-native-screens (^3.0.0)</Text>
      <Text style={styles.text}>react-native-dropdownalert (^4.1.0)</Text>
      <Text style={styles.text}>graceful-fs (^4.2.6)</Text>
      <Text style={styles.text}>lodash (^4.17.4)</Text>
      <Text style={styles.text}>react-native-sound (^0.10.3)</Text>
      <Text style={styles.text}>@react-navigation/bottom-tabs (^5.11.9)</Text>
      <Text style={styles.text}>react-native (^0.60.4)</Text>
      <Text style={styles.text}>react-native-call-detection (^1.9.0)</Text>
      <Text style={styles.text}>react-native-music-control (^0.10.5)</Text>
      <Text style={styles.text}>@react-native-community/toolbar-android (0.1.0-rc.2)</Text>
      <Text style={styles.text}>react-redux (^7.1.0)</Text>
      <Text style={styles.text}>react-lifecycles-compat (^3.0.4)</Text>
      <Text style={styles.text}>react-native-camera (^3.43.5)</Text>
      <Text style={styles.text}>redux (^3.7.2)</Text>
      <Text style={styles.text}>redux-thunk (^2.3.0)</Text>
      <Text style={styles.text}>@react-native-async-storage/async-storage (^1.15.1)</Text>
      <Text style={styles.text}>react-native-safe-area-context (^3.2.0)</Text>
      <Text style={styles.text}>rn-fetch-blob (^0.10.16)</Text>
      <Text style={styles.text}>@react-navigation/native (^5.9.4)</Text>
      <Text style={styles.text}>base-64 (^0.1.0)</Text>
      <Text style={styles.text}>moment (^2.18.1)</Text>
      <Text style={styles.text}>react-native-vector-icons (^8.1.0)</Text>
      <Text style={styles.text}>@react-native-community/masked-view (^0.1.10)</Text>
      <Text style={styles.text}>react (^16.8.6)</Text>
      <Text style={styles.text}>react-native-gesture-handler (^1.10.3)</Text>
      <Text style={styles.text}>react-native-reanimated (^1.13.3)</Text>
      <Text style={styles.text}>redux-persist (^4.8.2)</Text>
      <Text style={styles.text}>@react-navigation/stack (^5.14.4)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 75,
    paddingBottom: 50,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
  header: {
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 15,
  },
  thankyou: {
    fontStyle: 'italic',
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 15,
  },
});
