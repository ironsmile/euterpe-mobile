import React from 'react';
import {
    Text,
    StyleSheet,
    View,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';

import { SETTINGS_CHANGED } from '@reducers/settings';
import { TextInput } from '@components/text-input';
import { IconButton } from '@components/icon-button';
import { finishLogOut } from '@actions/settings';

export class SettingsRenderer extends React.Component {
    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text style={styles.header}>Library Settings</Text>

                    <TextInput
                        placeholder="Host Address"
                        returnKeyType="next"
                        value={this.props.settings.hostAddress}
                        onChangeText={(text) => {
                            this.props.dispatch({
                                ...this.props.settings,
                                type: SETTINGS_CHANGED,
                                hostAddress: text,
                            });
                        }}
                        onSubmitEditing={() => {
                            this.refs.UsernameInput.focus();
                        }}
                    />

                    <TextInput
                        ref="UsernameInput"
                        placeholder="Username"
                        returnKeyType="next"
                        value={this.props.settings.username}
                        onChangeText={(text) => {
                            this.props.dispatch({
                                ...this.props.settings,
                                type: SETTINGS_CHANGED,
                                username: text,
                            });
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
                            this.props.dispatch({
                                ...this.props.settings,
                                type: SETTINGS_CHANGED,
                                password: text,
                            });
                        }}
                        secureTextEntry={true}
                        onSubmitEditing={Keyboard.dismiss}
                    />

                    <IconButton
                        text="Log Out"
                        iconName="log-out"
                        onPress={() => {
                            Keyboard.dismiss();
                            this.props.dispatch(finishLogOut());
                        }}
                    />

                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    header: {
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    }
});

const mapStateToProps = (state) => ({
    settings: state.settings,
});

export const Settings = connect(mapStateToProps)(SettingsRenderer);
