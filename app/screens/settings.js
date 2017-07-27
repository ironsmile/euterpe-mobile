import React from 'react';
import { Text, TextInput, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { SETTINGS_CHANGED } from '../reducers/settings';


export class SettingsRenderer extends React.Component {
    render() {
        return (
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
                />

                <TextInput
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
                />

                <TextInput
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
                />
            </View>
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
        backgroundColor: 'white',
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
