import React from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator,
} from 'react-native';
import _ from 'lodash';

import { Screen } from '@screens/screen';
import Header from '@screens/common/header';
import { Helpful } from '@components/helpful';
import { httpms } from '@components/httpms-service';
import { ArtistBig } from '@components/artist-big';

export class ArtistScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            errorLoading: false,
            errorObj: null,
            artist: null,
            albums: [],
        };
    }

    componentWillMount() {
        const { params } = this.props.route.params;
        const { artist } = this.state;

        if (!artist || artist !== params.artist) {
            this.setState({
                isLoading: true,
                errorLoading: false,
                artist: params.artist,
            });
            this.getArtistData(params.artist);
        }
    }

    getArtistData(artist) {
        if (!artist) {
            this.setState({
                isLoading: false,
                errorLoading: true,
                errorObj: 'No album was selected.',
            });

            return;
        }

        const artistLower = artist.toLowerCase();

        this.setState({
            isLoading: true,
        });

        const req = httpms.getSearchRequest(artist)

        fetch(req.url, {
          method: req.method,
          headers: req.headers,
        })
        .then((response) => {
            if (response.status !== 200) {
                throw response;
            }

            return response.json();
        })
        .then((responseJson) => {
            // !TODO: some validation checking
            const albums = responseJson.filter((item) => {
                return item.artist.toLowerCase() === artistLower;
            });

            const albumsWithCounts = {};

            albums.forEach((song) => {

                if (!albumsWithCounts[song.album_id]) {
                    albumsWithCounts[song.album_id] = {
                        artist: song.artist,
                        album: song.album,
                        album_id: song.album_id,
                        songsCount: 0,
                    };
                }

                albumsWithCounts[song.album_id].songsCount += 1;
            });

            const filteredAlbums = [];

            for (var [key, album] of Object.entries(albumsWithCounts)) {
                filteredAlbums.push(album);
            }

            this.setState({
                albums: filteredAlbums,
                isLoading: false,
                errorLoading: false,
            });
        })
        .catch((error) => {
            this.setState({
                errorLoading: true,
                isLoading: false,
                errorObj: error,
            });

            console.error('Error while GETting artist data', error);
        });
    }

    getHeader() {
        return (
            <Header
                title=""
                onBackButton={() => {
                    this.props.navigation.goBack();
                }}
            />
        );
    }

    renderError() {
        return (
            <Helpful
                iconName="warning"
                title="Error Loading Artist"
                firstLine="Getting info for this artist failed."
                secondLine={this.state.errorObj.toString()}
            />
        );
    }

    renderBody() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator />
                </View>
            );
        }

        if (this.state.errorLoading) {
            return this.renderError();
        }

        return (
            <ArtistBig
                artist={this.state.artist}
                albums={this.state.albums}
                onPressAlbum={(album) => {
                    this.props.navigation.navigate(
                        'SearchAlbum',
                        { album }
                    );
                }}
            />
        );
    }

    render() {
        return (
            <Screen
                navigation={this.props.navigation}
                header={this.getHeader()}
            >
                <View style={styles.container}>
                    {this.renderBody()}
                </View>
            </Screen>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10,
        height: '100%',
    },
    loadingContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
});
