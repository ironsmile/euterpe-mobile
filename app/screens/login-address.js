import React from 'react';
import { Text, StyleSheet, View, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import { Screen } from '@screens/screen';
import Header from '@screens/common/header';
import { CreateTabIcon, CreateTabLabel } from '@screens/common/tab-bar';
import { TextInput } from '@components/text-input';
import { login } from '@styles/global';
import { IconButton } from '@components/icon-button';
import { changeSettings, checkSettings, checkSuccess, checkError } from '@actions/settings';

export class LoginAddressScreenRenderer extends React.Component {

    getHeader() {
        return (
            <Header
                title="SERVER ADDRESS"
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
                    <Text style={login.errorMessage}>
                        {this.props.settings.checkErrorMessage}
                    </Text>
                </View>
            );
        }

        return (
            <Screen
                noTabBar={true}
                header={this.getHeader()}
                navigation={this.props.navigation}
            >
                <View style={login.container}>
                    <View style={login.buttonWrapper}>
                        <Text style={login.headerText}>HTTPMS Address</Text>
                        <Text style={login.subduedText}>
                            This is the address of your HTTPMS installation. It is the one you
                            use with your browser.
                        </Text>
                    </View>

                    <TextInput
                        placeholder="HTTP Address - https://..."
                        returnKeyType="done"
                        value={this.props.settings.hostAddress}
                        onChangeText={(text) => {
                            this.props.dispatch(changeSettings({
                                hostAddress: text,
                            }));
                        }}
                        onSubmitEditing={Keyboard.dismiss}
                    />

                    <IconButton
                        text="Continue"
                        iconName="checkmark-circle"
                        onPress={() => {
                            Keyboard.dismiss();
                            this.props.dispatch(checkSettings(
                                (responseJson) => {
                                    this.props.navigation.navigate('LoginSuccess');
                                },
                                (error) => {
                                    if (error.status === 401) {
                                        this.props.navigation.navigate('LoginCredentials');

                                        return;
                                    }

                                    let message = 'Error contacting the HTTPMS server';

                                    if (error.message) {
                                        message += ': ' + error.message;
                                    } else if (typeof error === "string") {
                                        message += ': ' + error;
                                    } else {
                                        // console.log(error);
                                    }

                                    this.props.dispatch(checkError(message));
                                }
                            ));
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

export const LoginAddressScreen = connect(mapStateToProps)(LoginAddressScreenRenderer);
