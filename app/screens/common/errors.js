import React from 'react';
import { connect } from 'react-redux';

import { IconButton } from '@components/icon-button';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import { headerHeight } from '@screens/common/header';
import { dismissErrors } from '@actions/errors';
import { gs } from '@styles/global';

class ErrorsOverlayRenderer extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  _renderHeader = () => {
    return (
      <View>
        <View style={{ height: headerHeight, width: 100 }} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.header}>Error Happened!</Text>
        </View>
      </View>
    );
  };

  _renderFooter = () => {
    return (
      <View style={styles.footerContainer}>
        <IconButton
          text="Dismiss"
          iconName="close"
          onPress={() => {
            this.props.dispatch(dismissErrors());
          }}
        />
      </View>
    );
  };

  _renderItem = ({ item, index }) => {
    let text = item;

    if (typeof text !== 'string') {
      text = JSON.stringify(text, null, 2);
    }

    return <Text style={styles.errorText}>{text}</Text>;
  };

  _keyExtractor = (item, index) => `${index}`;

  render() {
    if (this.props.errors.length < 1) {
      return null;
    }

    return (
      <View style={styles.wrapperView}>
        <FlatList
          style={this.props.style}
          data={this.props.errors}
          extraData={this.state}
          removeClippedSubviews
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ListHeaderComponent={this._renderHeader()}
          ListFooterComponent={this._renderFooter()}
          initialNumToRender={15}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperView: {
    width: '100%',
    height: '100%',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: gs.bg.backgroundColor,
  },
  headerTextContainer: {
    alignItems: 'center',
    paddingBottom: 15,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 20,
    color: gs.font.color,
  },
  errorText: {
    color: gs.font.color,
    fontSize: 16,
  },
  footerContainer: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginTop: 15,
    marginBottom: 15,
  },
});

const mapStateToProps = (state) => ({
  errors: state.errors.errors,
});

export const ErrorsOverlay = connect(mapStateToProps)(ErrorsOverlayRenderer);
