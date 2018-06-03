import React from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import { PlayList } from '@components/playlist';
import Images from '@assets/images';

class RecentlyPlayedArtistsRenderer extends React.Component {

    render() {
        const { artists, artistsObjects } = this.props.recentlyPlayed;

        if (artists.length < 1) {
            return null;
        }

        return (
            <PlayList
                title="Recently Played Artists"
                items={artists.map((artist) => artistsObjects[artist])}
                key={this.props.key}
                isLoading={false}
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
    recentlyPlayed: state.recentlyPlayed,
});

export const RecentlyPlayedArtists = connect(mapStateToProps)(RecentlyPlayedArtistsRenderer);
