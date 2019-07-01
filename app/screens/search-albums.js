import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import { Screen } from '@screens/screen';
import { AlbumsList } from '@components/albums-list';
import Header from '@screens/common/header';

class SearchAlbumsRenderer extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentWillMount() {
        this.filterUniqueAlbums(this.props);
    }

    filterUniqueAlbums(props) {
        const albums = {};
        const albumsArray = [];

        props.search.results.forEach((song) => {
            if (albums[song.album_id]) {
                return;
            }

            albums[song.album_id] = true;

            albumsArray.push({
                album: song.album,
                artist: song.artist,
                album_id: song.album_id,
            });
        });

        this.setState({
            albums: albumsArray,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.search.query === this.props.search.query) {
            return;
        }
        this.filterUniqueAlbums(nextProps);
    }

    getHeader() {
        return (
            <Header
                title={`"${this.props.search.query.toUpperCase()}" IN ALBUMS`}
                onBackButton={() => {
                    this.props.navigation.goBack();
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
                    <AlbumsList
                        headerText="Albums"
                        avoidHeader={true}
                        albums={this.state.albums}
                        onPressItem={(album) => {
                            this.props.navigation.navigate(
                                'SearchAlbum',
                                { album }
                            );
                        }}
                    />
                </View>
            </Screen>
        );
    }
}

const mapStateToProps = (state) => ({
    search: state.search,
});

export const SearchAlbums = connect(mapStateToProps)(SearchAlbumsRenderer);

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10,
        height: '100%',
    },
});
