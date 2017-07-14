import React from 'react';
import { Text } from 'react-native';


export class HomeScreen extends React.Component {

  static navigationOptions = {
    title: 'Home'
  };

  render() {
    return (
        <Text>This is the home screen</Text>
    );
  }

}
