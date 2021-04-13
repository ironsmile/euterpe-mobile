import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import D from '@screens/common/dimensions';
import { gs } from '@styles/global';

export class SmallClickable extends React.PureComponent {
  getAdditionalText() {
    if (!this.props.additionalText) {
      return null;
    }

    return (
      <View style={styles.additional}>
        <Text numberOfLines={1} style={styles.text}>
          {this.props.additionalText}
        </Text>
      </View>
    );
  }

  getLeftRectangle() {
    if (!this.props.leftRectangle) {
      return null;
    }

    return <View style={styles.imageContainer}>{this.props.leftRectangle}</View>;
  }

  getRightIcon() {
    if (!this.props.rightIcon) {
      return null;
    }

    return <Icon name={this.props.rightIcon} color="#aeafb3" size={16} />;
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          if (this.props.onSelect) {
            this.props.onSelect();
          }
        }}
      >
        <View style={styles.outerContainer}>
          {this.getLeftRectangle()}
          <View style={styles.resultContainer}>
            <Text numberOfLines={1} style={[gs.bolder, styles.textTitle]}>
              {this.props.mainText}
            </Text>
            {this.getAdditionalText()}
          </View>
          {this.getRightIcon()}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  resultContainer: {
    paddingTop: 3,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    width: D.width - 65,
  },
  text: {
    fontSize: 12,
    color: '#aeafb3',
  },
  textTitle: {
    color: 'white',
  },
  additional: {
    flex: 1,
    flexDirection: 'row',
  },
  outerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 2,
    paddingBottom: 2,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
});
