import React from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';

import { AlbumSmall } from '@components/album-small';
import { SongSmall } from '@components/song-small';
import { headerHeight } from '@screens/common/header';

class AlbumItem extends React.PureComponent {
    _onPress = () => {
        this.props.onPressItem(this.props.album);
    };

    render() {
        return (
            <AlbumSmall
                {...this.props}
                onSelect={this._onPress}
            />
        )
    }
}

export class AlbumsList extends React.PureComponent {

    _keyExtractor = (item, index) => item.albumID;

    _onPressItem = (album) => {
        if (this.props.onAlbumPress) {
            this.props.onAlbumPress(album);
        }
    };

    _renderItem = ({item, index}) => (
        <AlbumItem
            id={item.id}
            index={index}
            onPressItem={this._onPressItem}
            album={item}
        />
    );

    _renderHeader = () => {
        let headerAvoider = null;

        if (this.props.avoidHeader) {
            headerAvoider = (
                <View style={{height: headerHeight, width: 100}}></View>
            );
        }

        if (!this.props.headerText) {
            return headerAvoider;
        }

        return (
            <View>
                {headerAvoider}
                <View style={styles.headerTextContainer}>
                    <Text style={styles.header}>{this.props.headerText}</Text>
                </View>
            </View>
        );
    }

    render() {
        return (
            <FlatList
                style={this.props.style}
                data={this.props.albums}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                ListHeaderComponent={this._renderHeader()}
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
        fontSize: 16,
        color: 'white',
    },
});
