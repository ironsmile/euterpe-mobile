import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@screens/screen';
import Header from '@screens/common/header';
import { Helpful } from '@components/helpful';
import { httpms } from '@components/httpms-service';
import { ArtistBig } from '@components/artist-big';
import { errorToMessage } from '@helpers/errors';
import { ActivityIndicator } from '@components/activity-indicator';

export class ArtistScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    const { params } = this.props.route;

    this.state = {
      isLoading: true,
      errorLoading: false,
      errorObj: null,
      artist: params?.artist?.artist ?? null,
      artist_id: params?.artist?.artist_id ?? null,
      albums: [],
    };
  }

  componentDidMount() {
    if (this.state.artist) {
      this.getArtistData(this.state.artist);
    }
  }

  getArtistData(artist) {
    if (!artist) {
      this.setState({
        isLoading: false,
        errorLoading: true,
        errorObj: 'No album was selected.',
      });

      return;
    }

    const artistLower = artist.toLowerCase();

    this.setState({
      isLoading: true,
    });

    const req = httpms.getSearchRequest(artist);

    fetch(req.url, {
      method: req.method,
      headers: req.headers,
    })
      .then((response) => {
        if (response.status !== 200) {
          throw response;
        }

        return response.json();
      })
      .then((responseJson) => {
        // !TODO: some validation checking
        const albums = responseJson.filter((item) => {
          return item.artist.toLowerCase() === artistLower;
        });

        const albumsWithCounts = {};

        albums.forEach((song) => {
          if (!albumsWithCounts[song.album_id]) {
            albumsWithCounts[song.album_id] = {
              artist: song.artist,
              album: song.album,
              album_id: song.album_id,
              songsCount: 0,
            };
          }

          albumsWithCounts[song.album_id].songsCount += 1;
        });

        const filteredAlbums = [];

        // eslint-disable-next-line no-unused-vars
        for (var [key, album] of Object.entries(albumsWithCounts)) {
          filteredAlbums.push(album);
        }

        this.setState({
          albums: filteredAlbums,
          isLoading: false,
          errorLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          errorLoading: true,
          isLoading: false,
          errorMessage: errorToMessage(error),
        });

        console.error('Error while GETting artist data', error);
      });
  }

  getHeader() {
    return (
      <Header
        title=""
        onBackButton={() => {
          this.props.navigation.goBack();
        }}
      />
    );
  }

  renderError() {
    return (
      <Helpful
        iconName="warning"
        title="Error Loading Artist"
        firstLine="Getting info for this artist failed."
        secondLine={this.state.errorMessage}
      />
    );
  }

  renderBody() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      );
    }

    if (this.state.errorLoading) {
      return this.renderError();
    }

    return (
      <ArtistBig
        artist={this.state.artist}
        artist_id={this.state.artist_id}
        albums={this.state.albums}
        onPressAlbum={(album) => {
          this.props.navigation.navigate('SearchAlbum', { album });
        }}
      />
    );
  }

  render() {
    return (
      <Screen navigation={this.props.navigation} header={this.getHeader()}>
        <View style={styles.container}>{this.renderBody()}</View>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    height: '100%',
  },
  loadingContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
});
