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
import { httpms } from '@components/httpms-service';
import { AlbumBig } from '@components/album-big';
import { setPlaylist, appendToPlaylist } from '@actions/playing';
import { gs } from '@styles/global';

export class AlbumScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            errorLoading: false,
            errorObj: null,
            album: null,
            artwork: null,
            songs: [],
        };
    }

    componentWillMount() {
        const { params } = this.props.navigation.state;
        const { album } = this.state;

        if (!album || album.album_id !== params.album.album_id) {
            this.setState({
                isLoading: true,
                errorLoading: false,
                album: params.album,
                artwork: httpms.getAlbumArtworkURL(params.album.album_id),
            });
            this.getAlbumData(params.album);
        }
    }

    getAlbumData(album) {
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

        const req = httpms.getSearchRequest(album.album)

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
            const albumSongs = responseJson.filter((item) => {
                return item.album_id === album.album_id;
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
            <AlbumBig
                artwork={this.state.artwork}
                album={this.state.album}
                songs={this.state.songs}
                onPlayButton={() => {
                    this.props.dispatch(setPlaylist(this.state.songs, true));
                }}
                onPressSong={(song) => {
                    this.props.dispatch(setPlaylist([song], true));
                }}
                onAddToQueue={() => {
                    this.props.dispatch(appendToPlaylist(this.state.songs, true));
                    this.dropdown.alertWithType(
                        'success',
                        'Queue updated',
                        `${this.state.songs.length} songs added to queue.`
                    );
                }}
            />
        );
    }

    render() {
        return (
            <View style={styles.wrapperView}>
                <Screen
                    navigation={this.props.navigation}
                    header={this.getHeader()}
                >
                    <View style={styles.container}>
                        {this.renderBody()}
                    </View>
                </Screen>
                <DropdownAlert
                    ref={(ref) => this.dropdown = ref}
                    updateStatusBar={false}
                    closeInterval={2000}
                />
            </View>
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
    wrapperView: {
        width: '100%',
        height: '100%',
    },
});

export const AlbumScreen = connect()(AlbumScreenRenderer);
