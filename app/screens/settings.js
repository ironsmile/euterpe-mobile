import React from 'react';
import { Text, StyleSheet, View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { gs } from '@styles/global';
import { IconButton } from '@components/icon-button';
import { finishLogOut } from '@actions/settings';
import { cleanupRecentAlbums } from '@actions/recent-albums';
import { cleanupRecentArtists } from '@actions/recent-artists';
import { cleanupRecentlyPlayed } from '@actions/recently-played';
import { stopPlaying, cleanupPlaying } from '@actions/playing';

export class SettingsRenderer extends React.PureComponent {
  render() {
    let loginType = 'None, open server';
    const { settings, dispatch } = this.props;

    if (settings.token) {
      loginType = 'Bearer Token';
    } else if (settings.username) {
      loginType = 'Basic Authenticate';
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.header}>Library Settings</Text>

          <Text style={styles.text}>HTTPMS Address: {settings.hostAddress}</Text>

          <Text style={styles.text}>Authentication: {loginType}</Text>

          <IconButton
            text="Log Out"
            iconName="log-out"
            onPress={() => {
              Keyboard.dismiss();
              dispatch(cleanupRecentAlbums());
              dispatch(cleanupRecentArtists());
              dispatch(cleanupRecentlyPlayed());
              dispatch(stopPlaying());
              dispatch(cleanupPlaying());
              dispatch(finishLogOut());
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
