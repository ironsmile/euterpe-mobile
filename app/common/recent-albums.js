import React from 'react';
import { connect } from 'react-redux';

import { httpms } from '@components/httpms-service';
import { refreshRecentAlbums } from '@actions/recent-albums';
import { PlayList } from '@components/playlist';
import Images from '@assets/images';

class RecentAlbumsRenderer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    this.props.dispatch(refreshRecentAlbums());
  }

  render() {
    const { loading, albums } = this.props.recentAlbums;

    return (
      <PlayList
        title="Recently Added Albums"
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

const mapStateToProps = (state) => ({
  recentAlbums: state.recentAlbums,
});

export const RecentAlbums = connect(mapStateToProps)(RecentAlbumsRenderer);
