import React from 'react';
import {
    Text,
    TextInput,
    StyleSheet,
    View,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';
import { SETTINGS_CHANGED } from '../reducers/settings';


export class SettingsRenderer extends React.Component {
    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text style={styles.header}>Library Settings</Text>

                    <TextInput
                        placeholder="Host Address"
                        style={styles.input}
                        returnKeyType="next"
                        autoCorrect={false}
                        autoCapitalize="none"
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
                        underlineColorAndroid="rgba(0,0,0,0)"
                        keyboardAppearance="dark"
                        maxLength={256}
                        selectTextOnFocus={true}
                        placeholderTextColor="#aeafb3"
                        selectionColor="#7e97fc"
                    />

                    <TextInput
                        ref="UsernameInput"
                        placeholder="Username"
                        style={styles.input}
                        returnKeyType="next"
                        autoCorrect={false}
                        autoCapitalize="none"
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
                        underlineColorAndroid="rgba(0,0,0,0)"
                        keyboardAppearance="dark"
                        maxLength={256}
                        selectTextOnFocus={true}
                        placeholderTextColor="#aeafb3"
                        selectionColor="#7e97fc"
                    />

                    <TextInput
                        ref="PasswordInput"
                        placeholder="Password"
                        style={styles.input}
                        returnKeyType="done"
                        autoCorrect={false}
                        autoCapitalize="none"
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
                        underlineColorAndroid="rgba(0,0,0,0)"
                        keyboardAppearance="dark"
                        maxLength={256}
                        selectTextOnFocus={true}
                        placeholderTextColor="#aeafb3"
                        selectionColor="#7e97fc"
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
    input: {
        color: 'white',
        backgroundColor: '#46474A',
        borderRadius: 6,
        width: '85%',
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 20,
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
