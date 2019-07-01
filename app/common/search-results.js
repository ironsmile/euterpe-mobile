import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import { httpms } from '@components/httpms-service';
import { setPlaylist } from '@actions/playing';
import { SongSmall } from '@components/song-small';
import { AlbumSmall } from '@components/album-small';
import { ArtistSmall } from '@components/artist-small';

class SeeMore extends React.PureComponent {
    render() {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.onPress();
                }}
            >
                <View style={[styles.seeMoreContainer, styles.seeMoreComponents]}>
                    <Text style={styles.seeMoreText}>{this.props.text}</Text>
                    <Icon name="ios-arrow-forward" color="#aeafb3" size={16} />
                </View>
            </TouchableOpacity>
        );
    }
}

class ResultSection extends React.PureComponent {
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
    constructor(props) {
        super(props);

        this.state = {};
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
                <ScrollView
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode="on-drag"
                    showsVerticalScrollIndicator={false}
                >
                    <ResultSection
                        key={0}
                        title="Artists"
                        seeMoreText="See all artists"
                        onSeeMorePress={() => {
                            this.props.navigation.navigate('ArtistsResults');
                        }}
                    >
                        {this.props.search.topArtists.map((item, index) => (
                            <ArtistSmall
                                key={index}
                                artist={item}
                                onSelect={() => {
                                    this.props.navigation.navigate(
                                        'SearchArtist',
                                        { artist: item }
                                    );
                                }}
                            />
                        ))}
                    </ResultSection>

                    <ResultSection
                        key={1}
                        title="Albums"
                        seeMoreText="See all albums"
                        onSeeMorePress={() => {
                            this.props.navigation.navigate('AlbumsResults');
                        }}
                    >
                        {this.props.search.topAlbums.map((item, index) => (
                            <AlbumSmall
                                key={index}
                                album={item}
                                onSelect={() => {
                                    this.props.navigation.navigate(
                                        'SearchAlbum',
                                        { album: item }
                                    );
                                }}
                                artwork={httpms.getAlbumArtworkURL(item.album_id)}
                            />
                        ))}
                    </ResultSection>

                    <ResultSection
                        key={2}
                        title="Songs"
                        seeMoreText="See all songs"
                        onSeeMorePress={() => {
                            this.props.navigation.navigate('SongsResults');
                        }}
                    >
                        {this.props.search.topSongs.map((item, index) => (
                            <SongSmall
                                key={index}
                                song={item}
                                onSelect={() => {
                                    this.props.dispatch(setPlaylist([item], true));
                                }}
                                noLeftRightPadding={true}
                            />
                        ))}
                    </ResultSection>
                </ScrollView>
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
});

const mapStateToProps = (state) => ({
    search: state.search,
});

export const SearchResults = connect(mapStateToProps)(SearchResultsRenderer);
