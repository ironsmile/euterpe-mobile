import React from 'react';
import { Text } from 'react-native';


export class LoginScreen extends React.Component {

  static navigationOptions = {
    title: 'Login',
    header: null
  };

  render() {
    return (
        <Text>This is the login screen</Text>
    );
  }

}
