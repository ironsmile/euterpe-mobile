import React from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';

import { recentlyAddedError } from '@styles/global';
import { httpms } from '@components/httpms-service';
import { refreshRecentAlbums } from '@actions/recent-albums';
import { PlayList } from '@components/playlist';
import Images from '@assets/images';

class RecentAlbumsRenderer extends React.PureComponent {
  componentDidMount() {
    this.props.dispatch(refreshRecentAlbums());
  }

  render() {
    const { loading, albums, error } = this.props.recentAlbums;
    const title = 'Recently Added Albums';

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
        items={albums}
        key={this.props.key}
        isLoading={loading}
        onItemPress={(album) => {
          if (!this.props.onAlbumPress) {
            return;
          }
          this.props.onAlbumPress(album);
        }}
        getItemTitle={(item) => item.album}
        getItemSubTitle={(item) => item.artist}
        getItemArtwork={(item) => {
          return httpms.getAlbumArtworkURL(item.album_id);
        }}
        defaultItemSource={Images.unknownAlbum}
      />
    );
  }
}

const styles = StyleSheet.create(recentlyAddedError);

const mapStateToProps = (state) => ({
  recentAlbums: state.recentAlbums,
});

export const RecentAlbums = connect(mapStateToProps)(RecentAlbumsRenderer);
