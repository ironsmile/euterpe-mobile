import React from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import { refreshRecentAlbums } from '@actions/recent-albums';
import { PlayList } from '@components/playlist';
import Images from '@assets/images';

class RecentAlbumsRenderer extends React.Component {

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
                getItemArtwork={(item) => Images.unknownAlbum}
            />
        );
    }

}

const mapStateToProps = (state) => ({
    recentAlbums: state.recentAlbums,
});

export const RecentAlbums = connect(mapStateToProps)(RecentAlbumsRenderer);
