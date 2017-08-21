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

import { Screen } from '@screens/screen';
import Header from '@screens/common/header';
import { Helpful } from '@components/helpful';
import { HttpmsService } from '@components/httpms-service';
import { AlbumBig } from '@components/album-big';
import { setPlaylist } from '@actions/playing';

class AlbumScreenRenderer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            errorLoading: false,
            errorObj: null,
            album: null,
            songs: [],
        };
    }

    componentWillMount() {
        const { params } = this.props.navigation.state;
        const { album } = this.state;

        if (!album || album.albumID !== params.album.albumID) {
            this.setState({
                isLoading: true,
                errorLoading: false,
                album: params.album,
            });
            this.getAlbumData(params.album);
        }
    }

    getAlbumData(album) {
        const httpms = new HttpmsService(this.props.settings);

        if (!album) {
            this.setState({
                isLoading: false,
                errorLoading: true,
                errorObj: 'No album was selected.',
            });

            return;
        }

        this.setState({
            isLoading: true,
        });

        fetch(httpms.getSearchURL(album.album), {
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
            const albumSongs = responseJson.filter((item) => {
                return item.album_id === album.albumID;
            });

            this.setState({
                songs: _.sortBy(albumSongs, [
                    (val) => {
                        return val.track;
                    }
                ]),
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

            console.error('Error while GETting album data', error);
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
                title="Error Loading Album"
                firstLine="Getting info for this album failed."
                secondLine={this.state.errorObj}
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
            <AlbumBig
                album={this.state.album}
                songs={this.state.songs}
                onPlayButton={() => {
                    this.props.dispatch(setPlaylist(this.state.songs, true));
                }}
                onPressSong={(song) => {
                    this.props.dispatch(setPlaylist([song], true));
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
        paddingLeft: 15,
        paddingRight: 15,
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

export const AlbumScreen = connect(mapStateToProps)(AlbumScreenRenderer);
