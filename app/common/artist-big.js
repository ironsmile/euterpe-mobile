import React from 'react';
import { FlatList, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

import { AlbumSmall } from '@components/album-small';
import { headerHeight } from '@screens/common/header';
import Images from '@assets/images';
import D from '@screens/common/dimensions';
import { PlatformIcon } from '@components/platform-icon';
import { httpms } from '@components/httpms-service';

class QueueItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressAlbum(this.props.album);
  };

  render() {
    return <AlbumSmall {...this.props} withSongsCount={true} onSelect={this._onPress} />;
  }
}

export class ArtistBig extends React.PureComponent {
  _keyExtractor = (item, index) => item.album_id;

  _onPressAlbum = (album) => {
    if (this.props.onPressAlbum) {
      this.props.onPressAlbum(album);
    }
  };

  _renderItem = ({ item, index }) => {
    const artwork = httpms.getAlbumArtworkURL(item.album_id);

    return (
      <QueueItem onPressAlbum={this._onPressAlbum} index={index} album={item} artwork={artwork} />
    );
  };

  _renderFooter = () => {
    return <View style={styles.footer} />;
  };

  _renderHeader = () => {
    return (
      <View>
        <View style={styles.screenHeaderAvoider} />
        <View style={styles.headerTextContainer}>
          <Image style={styles.artistImage} source={Images.unknownArtist} />
          <Text style={styles.header}>{this.props.artist}</Text>
          <Text style={styles.subTitle}>Albums</Text>
        </View>
      </View>
    );
  };

  render() {
    return (
      <FlatList
        data={this.props.albums}
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
    width: 100,
  },
  subTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
  },
  artistImage: {
    width: D.width * (2 / 5),
    height: D.width * (2 / 5),
    borderRadius: (D.width * (2 / 5)) / 2,
  },
  footer: {
    width: 100,
    height: 40,
  },
});
