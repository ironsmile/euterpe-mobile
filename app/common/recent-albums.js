import React from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';

import { HttpmsService } from '@components/httpms-service';
import { refreshRecentAlbums } from '@actions/recent-albums';
import { PlayList } from '@components/playlist';
import Images from '@assets/images';

class RecentAlbumsRenderer extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            httpms: new HttpmsService(this.props.settings),
        };
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
                    return this.state.httpms.getAlbumArtworkURL(item.album_id);
                }}
                defaultItemSource={Images.unknownAlbum}
            />
        );
    }

}

const mapStateToProps = (state) => ({
    recentAlbums: state.recentAlbums,
    settings: state.settings,
});

export const RecentAlbums = connect(mapStateToProps)(RecentAlbumsRenderer);
