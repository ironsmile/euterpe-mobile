import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';

import { SongSmall } from '@components/song-small';
import { headerHeight } from '@screens/common/header';

class QueueItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.index);
  };

  render() {
    return <SongSmall {...this.props} onSelect={this._onPress} />;
  }
}

export class SongsList extends React.PureComponent {
  _keyExtractor = (item, index) => index;

  _onPressItem = (index: number) => {
    this.props.onPressItem(index);
  };

  _renderItem = ({ item, index }) => (
    <QueueItem
      id={item.id}
      index={index}
      onPressItem={this._onPressItem}
      song={item}
      highlighted={index === this.props.highlighted}
    />
  );

  _renderFooter = () => {
    return <View style={styles.footer} />;
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
        data={this.props.data}
        highlighted={this.props.highlighted}
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
    fontSize: 16,
    color: 'white',
  },
  footer: {
    width: 100,
    height: 40,
  },
});
