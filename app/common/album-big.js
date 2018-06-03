import React from 'react';
import { FlatList, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

import { SongSmall } from '@components/song-small';
import { headerHeight } from '@screens/common/header';
import Images from '@assets/images';
import D from '@screens/common/dimensions';
import { PlatformIcon } from '@components/platform-icon';

class QueueItem extends React.PureComponent {
    _onPress = () => {
        this.props.onPressSong(this.props.song);
    };

    render() {
        return (
            <SongSmall
                {...this.props}
                withAlbum={false}
                noLeftRightPadding={true}
                onSelect={this._onPress}
            />
        )
    }
}

export class AlbumBig extends React.PureComponent {

    _keyExtractor = (item, index) => item.id;

    _onPressSong = (song) => {
        if (this.props.onPressSong) {
            this.props.onPressSong(song);
        }
    };

    _renderItem = ({item, index}) => (
        <QueueItem
            onPressSong={this._onPressSong}
            id={item.id}
            index={index}
            song={item}
        />
    );

    _renderFooter = () => {
        return (
            <View style={styles.footer}></View>
        );
    }

    _renderHeader = () => {
        return (
            <View>
                <View style={styles.screenHeaderAvoider}></View>
                <View style={styles.headerTextContainer}>
                    <View style={styles.withShadow}>
                        <Image
                            style={styles.albumImage}
                            defaultSource={Images.unknownAlbum}
                            source={{uri: this.props.artwork}}
                        />
                    </View>
                    <Text style={styles.header}>
                        {this.props.album.album}
                    </Text>
                    <Text style={styles.artistName}>
                        ALBUM BY {this.props.album.artist.toUpperCase()}
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            if (this.props.onPlayButton) {
                                this.props.onPlayButton();
                            }
                        }}
                    >
                        <View style={styles.playButton}>
                            <Text style={styles.playButtonText}>PLAY</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            if (this.props.onAddToQueue) {
                                this.props.onAddToQueue();
                            }
                        }}
                    >
                        <View style={styles.addToQueueButton}>
                            <PlatformIcon platform="list" size={22}
                                style={styles.addToQueueButtonIcon} />
                            <Text style={styles.addToQueueButtonText}>
                                Append In Play Queue
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.includes}>
                        Includes
                    </Text>
                </View>
            </View>
        );
    }

    render() {
        return (
            <FlatList
                data={this.props.songs}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                ListHeaderComponent={this._renderHeader()}
                ListFooterComponent={this._renderFooter()}
            />
        );
    }
}

const styles = StyleSheet.create({
    headerTextContainer: {
        paddingTop: 30,
        alignItems: 'center',
        paddingBottom: 15,
    },
    header: {
        fontWeight: 'bold',
        fontSize: 24,
        color: 'white',
        marginTop: 20,
        textAlign: 'center',
    },
    screenHeaderAvoider: {
        height: headerHeight,
        width: 100
    },
    includes: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 30,
    },
    albumImage: {
        width: D.width * (2/5),
        height: D.width * (2/5),
    },
    withShadow: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 3
        },
        shadowRadius: 10,
        shadowOpacity: 0.5,
    },
    playButton: {
        backgroundColor: '#1db954',
        height: 50,
        borderRadius: 25,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 40,
        paddingRight: 40,
        justifyContent: 'center',
        marginTop: 20,
    },
    playButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 22,
    },
    artistName: {
        marginTop: 5,
        color: '#aeafb3',
        fontSize: 12,
        textAlign: 'center',
    },
    footer: {
        width: 100,
        height: 40,
    },
    addToQueueButton: {
        marginTop: 10,
        height: 30,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addToQueueButtonText: {
        color: '#aeafb3',
    },
    addToQueueButtonIcon: {
        color: '#aeafb3',
        marginRight: 10,
    },
});
