import React from 'react';
import { Text, View, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import { Screen } from '@screens/screen';
import Header from '@screens/common/header';
import { TextInput } from '@components/text-input';
import { login } from '@styles/global';
import { IconButton } from '@components/icon-button';
import { changeSettings, checkError, getToken } from '@actions/settings';

export class LoginCredentialsScreenRenderer extends React.PureComponent {
  getHeader() {
    return (
      <Header
        title="LOGIN CREDS"
        onBackButton={() => {
          this.props.navigation.goBack();
        }}
      />
    );
  }

  render() {
    let errorMessage = null;

    if (this.props.settings.checkError) {
      errorMessage = (
        <View style={login.errorContaier}>
          <Text style={login.errorMessage}>{this.props.settings.checkErrorMessage}</Text>
        </View>
      );
    }

    return (
      <Screen noTabBar={true} header={this.getHeader()} navigation={this.props.navigation}>
        <View style={login.container}>
          <View style={login.buttonWrapper}>
            <Text style={login.headerText}>Username and Password</Text>
            <Text style={login.subduedText}>
              This Euterpe server requires authorization with username and password. Please, enter
              yours below.
            </Text>
          </View>

          <TextInput
            placeholder="Username"
            returnKeyType="next"
            value={this.props.settings.username}
            onChangeText={(text) => {
              this.props.dispatch(
                changeSettings({
                  username: text,
                })
              );
            }}
            onSubmitEditing={() => {
              this.refs.PasswordInput.focus();
            }}
          />

          <TextInput
            ref="PasswordInput"
            placeholder="Password"
            returnKeyType="done"
            value={this.props.settings.password}
            onChangeText={(text) => {
              this.props.dispatch(
                changeSettings({
                  password: text,
                })
              );
            }}
            secureTextEntry={true}
            onSubmitEditing={Keyboard.dismiss}
          />

          <IconButton
            text="Continue"
            iconName="checkmark-circle"
            onPress={() => {
              Keyboard.dismiss();
              this.props.dispatch(
                getToken(
                  (responseJson) => {
                    this.props.navigation.navigate('LoginSuccess');
                  },
                  (error) => {
                    if (error.status === 401) {
                      this.props.dispatch(checkError('Wrong username or password'));

                      return;
                    }

                    let message = 'Error contacting the Euterpe server';

                    if (error.message) {
                      message += ': ' + error.message;
                    } else if (typeof error === 'string') {
                      message += ': ' + error;
                    } else {
                      // console.log(error);
                    }

                    this.props.dispatch(checkError(message));
                  }
                )
              );
            }}
            disabled={this.props.settings.checking}
            disabledText="Trying..."
          />

          {errorMessage}

          <KeyboardSpacer />
        </View>
      </Screen>
    );
  }
}

const mapStateToProps = (state) => ({
  settings: state.settings,
});

export const LoginCredentialsScreen = connect(mapStateToProps)(LoginCredentialsScreenRenderer);
