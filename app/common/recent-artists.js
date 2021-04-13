import React from 'react';
import { connect } from 'react-redux';
import { refreshRecentArtists } from '@actions/recent-artists';
import { PlayList } from '@components/playlist';
import Images from '@assets/images';

class RecentArtistsRenderer extends React.Component {
  componentWillMount() {
    this.props.dispatch(refreshRecentArtists());
  }

  render() {
    const { loading, artists } = this.props.recentArtists;

    return (
      <PlayList
        title="Recently Added Artists"
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
        getItemArtwork={(item) => Images.unknownArtist}
        defaultItemSource={Images.unknownArtist}
        circle
      />
    );
  }
}

const mapStateToProps = (state) => ({
  recentArtists: state.recentArtists,
});

export const RecentArtists = connect(mapStateToProps)(RecentArtistsRenderer);
