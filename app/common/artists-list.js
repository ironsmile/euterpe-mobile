import React from 'react';
import { FlatList, View, StyleSheet, Text, ActivityIndicator } from 'react-native';

import { ArtistSmall } from '@components/artist-small';
import { headerHeight } from '@screens/common/header';

class ArtistItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.artist);
  };

  render() {
    return <ArtistSmall {...this.props} onSelect={this._onPress} />;
  }
}

export class ArtistsList extends React.PureComponent {
  _keyExtractor = (item, index) => `${index}`;

  _onPressItem = (artist) => {
    if (this.props.onPressItem) {
      this.props.onPressItem(artist);
    }
  };

  _renderItem = ({ item, index }) => (
    <ArtistItem index={index} onPressItem={this._onPressItem} artist={item.artist} />
  );

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
        data={this.props.data}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ListHeaderComponent={this._renderHeader()}
        ListFooterComponent={this._renderFooter()}
        onEndReachedThreshold={this.props.onEndReachedThreshold}
        onEndReached={this.props.onEndReached}
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
