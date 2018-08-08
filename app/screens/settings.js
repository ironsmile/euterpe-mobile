import React from 'react';
import {
    Text,
    StyleSheet,
    View,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import { gs } from '@styles/global';
import { SETTINGS_CHANGED } from '@reducers/settings';
import { TextInput } from '@components/text-input';
import { IconButton } from '@components/icon-button';
import { finishLogOut } from '@actions/settings';
import { cleanupRecentAlbums } from '@actions/recent-albums';
import { cleanupRecentArtists } from '@actions/recent-artists';
import { stopPlaying } from '@actions/playing';

const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'LoginMain' }),
    ],
});

export class SettingsRenderer extends React.Component {
    render() {
        let loginType = "None, open server";

        if (this.props.settings.token) {
            loginType = "Bearer Token";
        } else if (this.props.settings.username) {
            loginType = "Basic Authenticate";
        }

        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text style={styles.header}>Library Settings</Text>

                    <Text style={styles.text}>
                        HTTPMS Address: {this.props.settings.hostAddress}
                    </Text>

                    <Text style={styles.text}>
                        Authentication: {loginType}
                    </Text>

                    <IconButton
                        text="Log Out"
                        iconName="log-out"
                        onPress={() => {
                            Keyboard.dismiss();
                            this.props.dispatch(cleanupRecentAlbums());
                            this.props.dispatch(cleanupRecentArtists());
                            this.props.dispatch(finishLogOut());
                            this.props.dispatch(stopPlaying(true));
                            this.props.navigation.dispatch(resetAction);
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
    },
    text: {
        ...gs.font,
        marginBottom: 10,
    },
});

const mapStateToProps = (state) => ({
    settings: state.settings,
});

export const Settings = connect(mapStateToProps)(SettingsRenderer);
