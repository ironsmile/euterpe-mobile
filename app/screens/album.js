import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import DropdownAlert from 'react-native-dropdownalert';

import { Screen } from '@screens/screen';
import Header from '@screens/common/header';
import { Helpful } from '@components/helpful';
import { httpms } from '@components/httpms-service';
import { AlbumBig } from '@components/album-big';
import { setPlaylist, appendToPlaylist } from '@actions/playing';
import { errorToMessage } from '@helpers/errors';
import { ActivityIndicator } from '@components/activity-indicator';

class AlbumScreenRenderer extends React.PureComponent {
  constructor(props) {
    super(props);
    const { params } = this.props.route;

    this.state = {
      isLoading: true,
      errorLoading: false,
      errorMessage: null,
      album: params?.album ?? null,
      artwork: params?.album?.album_id ? httpms.getAlbumArtworkURL(params.album.album_id) : null,
      songs: [],
    };
  }

  componentDidMount() {
    const { params } = this.props.route;
    if (params.album) {
      this.getAlbumData(params.album);
    }
  }

  getAlbumData(album) {
    if (!album) {
      this.setState({
        isLoading: false,
        errorLoading: true,
        errorMessage: 'No album was selected.',
        artwork: null,
      });

      return;
    }

    this.setState({
      isLoading: true,
    });

    const req = httpms.getSearchRequest(album.album);

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
        const albumSongs = responseJson.filter((item) => {
          return item.album_id === album.album_id;
        });

        this.setState({
          songs: _.sortBy(albumSongs, [
            (val) => {
              return val.track;
            },
          ]),
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

        console.error('Error while GETting album data', error);
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
        title="Error Loading Album"
        firstLine="Getting info for this album failed."
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
      <AlbumBig
        artwork={this.state.artwork}
        album={this.state.album}
        songs={this.state.songs}
        onPlayButton={() => {
          this.props.dispatch(setPlaylist(this.state.songs, true));
        }}
        onPressSong={(song) => {
          this.props.dispatch(setPlaylist([song], true));
        }}
        onAddToQueue={() => {
          this.props.dispatch(appendToPlaylist(this.state.songs, true));
          this.dropdown.alertWithType(
            'success',
            'Queue updated',
            `${this.state.songs.length} songs added to queue.`
          );
        }}
      />
    );
  }

  render() {
    return (
      <View style={styles.wrapperView}>
        <Screen navigation={this.props.navigation} header={this.getHeader()}>
          <View style={styles.container}>{this.renderBody()}</View>
        </Screen>
        <DropdownAlert
          ref={(ref) => (this.dropdown = ref)}
          updateStatusBar={false}
          closeInterval={2000}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 15,
    paddingRight: 15,
    height: '100%',
  },
  loadingContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  wrapperView: {
    width: '100%',
    height: '100%',
  },
});

export const AlbumScreen = connect()(AlbumScreenRenderer);
