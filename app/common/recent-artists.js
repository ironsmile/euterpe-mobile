import React from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';

import { recentlyAddedError } from '@styles/global';
import { refreshRecentArtists } from '@actions/recent-artists';
import { PlayList } from '@components/playlist';
import { httpms } from '@components/httpms-service';
import Images from '@assets/images';

class RecentArtistsRenderer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
    this.props.dispatch(refreshRecentArtists());
  }

  render() {
    const { loading, artists, error } = this.props.recentArtists;
    const title = 'Recently Added Artists';

    if (error != null) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text>Error loading recent albums:</Text>
          <Text>{error}</Text>
        </View>
      );
    }

    return (
      <PlayList
        title={title}
        items={artists}
        key={this.props.key}
        isLoading={loading}
        onItemPress={(artist) => {
          if (!this.props.onArtistPress) {
            return;
          }
          this.props.onArtistPress(artist);
        }}
        getItemTitle={(item) => item.artist}
        getItemSubTitle={(item) => null}
        getItemArtwork={(item) => {
          if (item.artist_id) {
            return httpms.getArtistImageURL(item.artist_id);
          }
          return Images.unknownArtist;
        }}
        defaultItemSource={Images.unknownArtist}
        circle
      />
    );
  }
}

const styles = StyleSheet.create(recentlyAddedError);

const mapStateToProps = (state) => ({
  recentArtists: state.recentArtists,
});

export const RecentArtists = connect(mapStateToProps)(RecentArtistsRenderer);
