import React from 'react';
import { FlatList, View, StyleSheet, Text, ActivityIndicator } from 'react-native';

import { AlbumSmall } from '@components/album-small';
import { headerHeight } from '@screens/common/header';

class AlbumItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.album);
  };

  render() {
    return <AlbumSmall {...this.props} onSelect={this._onPress} />;
  }
}

export class AlbumsList extends React.PureComponent {
  state = { selected: (new Map(): Map<int, boolean>) };

  _keyExtractor = (item, index) => item.album_id;

  _onPressItem = (album) => {
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(album.album_id, !selected.get(album.album_id)); // toggle
      return { selected };
    });

    if (this.props.onPressItem) {
      this.props.onPressItem(album);
    }
  };

  _renderItem = ({ item, index }) => {
    return (
      <AlbumItem
        id={item.id}
        index={index}
        onPressItem={this._onPressItem}
        album={item}
        selected={!!this.state.selected.get(item.album_id)}
      />
    );
  };

  _renderFooter = () => {
    if (!this.props.showLoadingIndicator) {
      return <View style={styles.footer} />;
    }

    return (
      <View style={styles.footerWithLoading}>
        <ActivityIndicator />
      </View>
    );
  };

  _renderHeader = () => {
    let headerAvoider = null;

    if (this.props.avoidHeader) {
      headerAvoider = <View style={{ height: headerHeight, width: 100 }} />;
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
  };

  render() {
    return (
      <FlatList
        style={this.props.style}
        data={this.props.albums}
        extraData={this.state}
        removeClippedSubviews
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ListHeaderComponent={this._renderHeader()}
        ListFooterComponent={this._renderFooter()}
        onEndReachedThreshold={this.props.onEndReachedThreshold}
        onEndReached={this.props.onEndReached}
        initialNumToRender={15}
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
  footer: {
    width: 100,
    height: 40,
  },
  footerWithLoading: {
    paddingTop: 10,
    paddingBottom: 20,
  },
});
