import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Screen } from '@screens/screen';

export class AboutScreen extends React.PureComponent {
  render() {
    return (
      <Screen title="ABOUT" navigation={this.props.navigation}>
        <View style={styles.container}>
          <Text style={[styles.text, styles.header]}>HTTPMS Mobile Player</Text>

          <Text style={styles.text}>Version: 0.1 Beta</Text>

          <Text style={[styles.text, styles.header]}>OpenSource projects used in this app:</Text>

          <Text style={styles.text}>ReactNative</Text>

          <Text style={styles.text}>ggomaeng's UI experiment</Text>

          <Text style={[styles.text, styles.thankyou]}>
            Thank you all for your hard work which made this app possible!
          </Text>
        </View>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
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
