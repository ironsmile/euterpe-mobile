import React from 'react';
import {
    View,
    Text,
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
import { FOOTER_HEIGHT } from '../screens/common/footer';
import Images from '@assets/images';
import D from '../screens/common/dimensions';
import { SongSmall } from './song-small';

class AlbumResult extends React.PureComponent {
    render() {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.onSelect();
                }}
            >
                <View style={styles.resultRowOuterContainer}>
                    <View style={styles.resultRowContainer}>
                        <Image
                            style={styles.resultRow}
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

class ArtistResult extends React.PureComponent {
    render() {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.onSelect();
                }}
            >
                <View style={styles.resultRowOuterContainer}>
                    <View style={styles.resultRowContainer}>
                        <Image
                            style={[
                                styles.resultRow,
                                styles.resultCircularImage,
                            ]}
                            source={Images.unknownArtist}
                        />
                    </View>
                    <View style={styles.resultContainer}>
                        <Text
                            numberOfLines={1}
                            style={styles.textTitle}
                        >
                            {this.props.artist}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

class SeeMore extends React.PureComponent {
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
                        onSeeMorePress={() => {}}
                    >
                        {this.props.search.topArtists.map((item, index) => (
                            <ArtistResult
                                key={index}
                                artist={item}
                                onSelect={() => {
                                    //!Todo
                                }}
                            />
                        ))}
                    </ResultSection>

                    <ResultSection
                        key={1}
                        title="Albums"
                        seeMoreText="See all albums"
                        onSeeMorePress={() => {
                            this.props.navigation.navigate('Album');
                        }}
                    >
                        {this.props.search.topAlbums.map((item, index) => (
                            <AlbumResult
                                key={index}
                                album={item}
                                onSelect={() => {
                                    this.props.dispatch(playAlbum(
                                        item,
                                        this.props.onError
                                    ));
                                }}
                            />
                        ))}
                    </ResultSection>

                    <ResultSection
                        key={2}
                        title="Songs"
                        seeMoreText="See all songs"
                        onSeeMorePress={() => {}}
                    >
                        {this.props.search.topSongs.map((item, index) => (
                            <SongSmall
                                key={index}
                                song={item}
                                onSelect={() => {
                                    this.props.dispatch(setPlaylist([item]));
                                    this.props.dispatch(setTrack(0, this.props.onError));
                                }}
                                noLeftRightPadding={true}
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
    resultRowOuterContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 2,
        paddingBottom: 2,
    },
    resultRowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    resultRow: {
        width: 40,
        height: 40,
        alignSelf: 'center',
    },
    resultCircularImage: {
        borderRadius: 20,
    },
});

const mapStateToProps = (state) => ({
    search: state.search,
});

export const SearchResults = connect(mapStateToProps)(SearchResultsRenderer);
