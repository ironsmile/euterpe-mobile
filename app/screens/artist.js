import React from 'react';
import {
    Text,
    StyleSheet,
    View,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import DropdownAlert from 'react-native-dropdownalert';

import { Screen } from '@screens/screen';
import Header from '@screens/common/header';
import { Helpful } from '@components/helpful';
import { HttpmsService } from '@components/httpms-service';
import { ArtistBig } from '@components/artist-big';
import { setPlaylist, appendToPlaylist } from '@actions/playing';
import { gs } from '@styles/global';

class ArtistScreenRenderer extends React.Component {
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
        const { params } = this.props.navigation.state;
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
        const httpms = new HttpmsService(this.props.settings);

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

        fetch(httpms.getSearchURL(artist), {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...httpms.getAuthCredsHeader()
          },
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

const mapStateToProps = (state) => ({
    settings: state.settings,
});

export const ArtistScreen = connect(mapStateToProps)(ArtistScreenRenderer);
