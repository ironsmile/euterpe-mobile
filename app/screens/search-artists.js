import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import { Screen } from '@screens/screen';
import { ArtistsList } from '@components/artists-list';
import Header from '@screens/common/header';

class SearchArtistsRenderer extends React.PureComponent {
  constructor(props) {
    super(props);

    const artists = {};
    const artistsArray = [];

    props.search.results.forEach((song) => {
      if (artists[song.artist]) {
        return;
      }

      artists[song.artist] = true;

      artistsArray.push({
        artist: song.artist,
      });
    });

    this.state = {
      artists: artistsArray,
    };
  }

  getHeader() {
    return (
      <Header
        title={`"${this.props.search.query.toUpperCase()}" IN ARTISTS`}
        onBackButton={() => {
          this.props.navigation.goBack();
        }}
      />
    );
  }

  render() {
    return (
      <Screen navigation={this.props.navigation} header={this.getHeader()}>
        <View style={styles.container}>
          <ArtistsList
            headerText="Artists"
            avoidHeader={true}
            data={this.state.artists}
            onPressItem={(artist) => {
              this.props.navigation.navigate('SearchArtist', { artist: artist });
            }}
          />
        </View>
      </Screen>
    );
  }
}

const mapStateToProps = (state) => ({
  search: state.search,
});

export const SearchArtists = connect(mapStateToProps)(SearchArtistsRenderer);

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    height: '100%',
  },
});
