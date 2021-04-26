import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';

import { Screen } from '@screens/screen';
import { SongsList } from '@components/songs-list';
import { setPlaylist } from '@actions/playing';
import Header from '@screens/common/header';

class SearchSongsRenderer extends React.PureComponent {
  getHeader() {
    return (
      <Header
        title={`"${this.props.search.query.toUpperCase()}" IN SONGS`}
        onBackButton={() => {
          this.props.navigation.goBack();
        }}
      />
    );
  }

  render() {
    return (
      <Screen navigation={this.props.navigation} header={this.getHeader()}>
        <View style={styles.songListContainer}>
          <SongsList
            headerText="Songs"
            avoidHeader={true}
            data={this.props.search.results}
            onPressItem={(index) => {
              const playlist = [this.props.search.results[index]];

              this.props.dispatch(setPlaylist(playlist, true));
            }}
          />
        </View>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  songListContainer: {
    paddingLeft: 10,
    paddingRight: 10,
  },
});

const mapStateToProps = (state) => ({
  search: state.search,
});

export const SearchSongs = connect(mapStateToProps)(SearchSongsRenderer);
