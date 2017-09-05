import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Screen } from '@screens/screen';
import { SmallClickable } from '@components/small-clickable';
import { PlatformIcon } from '@components/platform-icon';
import { headerHeight } from '@screens/common/header';

export class BrowseScreen extends React.PureComponent {

    getArtistsIcon() {
        return (
            <PlatformIcon
                style={styles.sectionIcon}
                platform="microphone"
                color="#aeafb3"
                size={30}
            />
        );
    }

    getAlbumsIcon() {
        return (
            <PlatformIcon
                style={styles.sectionIcon}
                platform="disc"
                color="#aeafb3"
                size={30}
            />
        );
    }

    getLibraryIcon() {
        return (
            <PlatformIcon
                style={styles.sectionIcon}
                ios="ios-book"
                md="ios-book"
                color="#aeafb3"
                size={30}
            />
        );
    }

    getSongsIcon() {
        return (
            <PlatformIcon
                style={styles.sectionIcon}
                platform="musical-notes"
                color="#aeafb3"
                size={30}
            />
        );
    }

    render() {
        return (
            <Screen
                title="BROWSE"
                navigation={this.props.navigation}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.headerAvoider} />

                    <View style={styles.encouragmentContainer}>
                        <Text style={styles.subduedText}>
                            Not sure what exactly do you feel like listening to?
                            I have an advice for you. Just browse around your
                            music and in no time you will find something. Promise!
                        </Text>
                    </View>

                    <SmallClickable
                        onSelect={() => {
                            this.props.navigation.navigate('BrowseArtists');
                        }}
                        mainText="Browse Artists"
                        leftRectangle={this.getArtistsIcon()}
                        rightIcon="ios-arrow-forward"
                    />

                    <SmallClickable
                        onSelect={() => {
                            this.props.navigation.navigate('BrowseAlbums');
                        }}
                        mainText="Browse Albums"
                        leftRectangle={this.getAlbumsIcon()}
                        rightIcon="ios-arrow-forward"
                    />

                    <SmallClickable
                        onSelect={() => {
                            this.props.navigation.navigate('BrowseSongs');
                        }}
                        mainText="Browse Songs"
                        leftRectangle={this.getSongsIcon()}
                        rightIcon="ios-arrow-forward"
                    />

                    <SmallClickable
                        onSelect={() => {
                            this.props.screenProps.rootNavigation.navigate('Library');
                        }}
                        mainText="Offline Library"
                        leftRectangle={this.getLibraryIcon()}
                        rightIcon="ios-arrow-forward"
                    />

                    <View style={styles.encouragmentContainer}>
                        <Text style={styles.subduedText}>
                            Don't feel like going through all of your music?
                            No problem with that! Try searching:
                        </Text>
                    </View>

                    <View style={[styles.encouragmentContainer, styles.noMargins]}>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.screenProps.rootNavigation.navigate('Search');
                            }}
                        >
                            <View style={styles.searchButton}>
                                <PlatformIcon platform="search" color="white" size={16} />
                                <Text style={styles.searchText}>SEARCH</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Screen>
        );
    }
}

const styles = StyleSheet.create({
    headerAvoider: {
        width: 100,
        height: headerHeight,
    },
    sectionIcon: {
        alignSelf: 'center',
        paddingLeft: 10,
    },
    subduedText: {
        'color': '#aeafb3',
        textAlign: 'center',
    },
    encouragmentContainer: {
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 50,
        marginRight: 50,
        alignItems: 'center',
    },
    noMargins: {
        marginTop: 0,
        marginBottom: 0,
    },
    searchButton: {
        backgroundColor: '#222327',
        borderRadius: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 20,
        borderWidth: 2,
        borderColor: '#3c3d41',
        flexDirection: 'row',
    },
    searchText: {
        paddingLeft: 10,
        fontWeight: 'bold',
        color: 'white',
    },
});
