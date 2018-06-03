import React from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';

import { HttpmsService } from '@components/httpms-service';
import { PlayList } from '@components/playlist';
import Images from '@assets/images';

class RecentlyPlayedAlbumsRenderer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            httpms: new HttpmsService(this.props.settings),
        };
    }

    render() {
        const { albums, albumsObjects } = this.props.recentlyPlayed;

        if (albums.length < 1) {
            return null;
        }

        return (
            <PlayList
                title="Recently Played Albums"
                items={albums.map((albumID) => albumsObjects[albumID])}
                key={this.props.key}
                isLoading={false}
                onItemPress={(album) => {
                    if (!this.props.onAlbumPress) {
                        return;
                    }
                    this.props.onAlbumPress(album);
                }}
                getItemTitle={(item) => item.album}
                getItemSubTitle={(item) => item.artist}
                getItemArtwork={(item) => {
                    return this.state.httpms.getAlbumArtworkURL(item.album_id);
                }}
                defaultItemSource={Images.unknownAlbum}
            />
        );
    }

}

const mapStateToProps = (state) => ({
    recentlyPlayed: state.recentlyPlayed,
    settings: state.settings,
});

export const RecentlyPlayedAlbums = connect(mapStateToProps)(RecentlyPlayedAlbumsRenderer);
