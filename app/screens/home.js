import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Screen } from '@screens/screen';
import { RecentArtists } from '@components/recent-artists';
import { RecentAlbums } from '@components/recent-albums';
import { RecentlyPlayedArtists } from '@components/recently-played-artists';
import { RecentlyPlayedAlbums } from '@components/recently-played-albums';

export class HomeScreen extends React.PureComponent {
  render() {
    return (
      <Screen title="HOME" navigation={this.props.navigation}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.spacer} />
            <RecentArtists
              key={0}
              onArtistPress={(item) => {
                this.props.navigation.navigate('SearchArtist', { artist: item.artist });
              }}
            />
            <RecentAlbums
              key={1}
              onAlbumPress={(item) => {
                this.props.navigation.navigate('SearchAlbum', { album: item });
              }}
            />
            <RecentlyPlayedArtists
              key={3}
              onArtistPress={(item) => {
                this.props.navigation.navigate('SearchArtist', { artist: item.artist });
              }}
            />
            <RecentlyPlayedAlbums
              key={2}
              onAlbumPress={(item) => {
                this.props.navigation.navigate('SearchAlbum', { album: item });
              }}
            />
          </ScrollView>
        </View>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spacer: {
    height: 50,
    width: '100%',
  },
});
