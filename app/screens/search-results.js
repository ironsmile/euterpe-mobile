import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ActivityIndicator,
    ScrollView,
    Image,
} from 'react-native';
import { connect } from 'react-redux';
import { setPlaylist, setTrack, playAlbum } from '../actions/playing';
import Icon from 'react-native-vector-icons/Ionicons';
import { FOOTER_HEIGHT } from './common/footer';
import Images from '@assets/images';
import D from './common/dimensions';
import { SongSmall } from '../common/song-small';

class AlbumResult extends React.Component {
    render() {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.onSelect();
                }}
            >
                <View style={styles.albumContainer}>
                    <View style={styles.albumImageContainer}>
                        <Image
                            style={styles.albumImage}
                            source={Images.unknownAlbum}
                        />
                    </View>
                    <View style={styles.resultContainer}>
                        <Text
                            numberOfLines={1}
                            style={styles.textTitle}
                        >
                            {this.props.album.album}
                        </Text>
                        <View style={styles.additional}>
                            <Text
                                numberOfLines={1}
                                style={styles.text}
                            >
                                {this.props.album.artist}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

class SeeMore extends React.Component {
    render() {
        return (
            <View style={styles.seeMoreContainer}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.onPress();
                    }}
                    style={styles.seeMoreComponents}
                >
                    <Text style={styles.seeMoreText}>{this.props.text}</Text>
                    <Icon name="ios-arrow-forward" color="white" size={16} />
                </TouchableOpacity>
            </View>
        );
    }
}

class ResultSection extends React.Component {
    render() {
        return (
            <View style={styles.resultSection}>
                <Text style={styles.header}>{this.props.title}</Text>
                {this.props.children}
                <SeeMore
                    text={this.props.seeMoreText}
                    onPress={() => {
                        this.props.onSeeMorePress();
                    }}
                />
            </View>
        );
    }
}

export class SearchResultsRenderer extends React.Component {

    getFewAlbums() {
        // !TODO: move this to the getResults reducer
        let albums = {};
        let albumArray = [];
        let albumsLen = 0;

        this.props.search.results.forEach((song) => {
            if (albumsLen >= 5) {
                return;
            }

            if (albums[song.album_id]) {
                return;
            }

            albums[song.album_id] = true;

            albumArray.push({
                album: song.album,
                artist: song.artist,
                albumID: song.album_id,
            });

            albumsLen += 1;
        });

        return albumArray;
    }

    getFewSongs() {
        // !TODO: move this to the getResults reducer
        return this.props.search.results.slice(0, 5);
    }

    render() {

        if (this.props.search.isSearching) {
            return (
                <View style={styles.centered}>
                    <ActivityIndicator color="white" />
                </View>
            );
        }

        if (this.props.search.results.length === 0) {
            return (
                <View style={styles.centered}>
                    <Text style={[styles.textTitle, styles.textNotFound]}>
                        Nothing found for "{this.props.search.query}"
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <ScrollView>
                    <ResultSection
                        key={0}
                        title="Albums"
                        seeMoreText="See all albums"
                        onSeeMorePress={() => {}}
                    >
                        {this.getFewAlbums().map((item, index) => (
                            <AlbumResult
                                key={index}
                                album={item}
                                onSelect={() => {
                                    this.props.dispatch(playAlbum(
                                        item,
                                        this.props.onNetworkError
                                    ));
                                }}
                            />
                        ))}
                    </ResultSection>

                    <ResultSection
                        key={1}
                        title="Songs"
                        seeMoreText="See all songs"
                        onSeeMorePress={() => {}}
                    >
                        {this.getFewSongs().map((item, index) => (
                            <SongSmall
                                key={index}
                                song={item}
                                onSelect={() => {
                                    this.props.dispatch(setPlaylist([item]));
                                    this.props.dispatch(setTrack(0, this.props.onNetworkError));
                                }}
                            />
                        ))}
                    </ResultSection>
                </ScrollView>
                <View style={{ height: FOOTER_HEIGHT }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    resultContainer: {
        paddingTop: 3,
        justifyContent: 'center',
        paddingLeft: 10,
        width: D.width - 50,
    },
    text: {
        fontSize: 12,
        color: '#aeafb3',
    },
    textTitle: {
        color: 'white',
    },
    textNotFound: {
        textAlign: 'center',
    },
    header: {
        color: 'white',
        fontWeight: '900',
        textAlign: 'center',
    },
    additional: {
        flex: 1,
        flexDirection: 'row',
    },
    centered: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    seeMoreContainer: {
        width: '100%',
        height: 30,
        marginTop: 10,
        marginBottom: 10,
        paddingTop: 6,
        paddingBottom: 5,
    },
    seeMoreComponents: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    seeMoreText: {
        color: 'white',
        fontWeight: '600',
    },
    resultSection: {
        marginTop: 10,
        marginBottom: 10,
    },
    albumContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 2,
        paddingBottom: 2,
    },
    albumImageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    albumImage: {
        width: 40,
        height: 40,
        alignSelf: 'center',
    },
});

const mapStateToProps = (state) => ({
    search: state.search,
});

export const SearchResults = connect(mapStateToProps)(SearchResultsRenderer);
