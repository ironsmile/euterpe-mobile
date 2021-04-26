import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import D from '@screens/common/dimensions';
import { gs } from '@styles/global';

export class SmallClickable extends React.PureComponent {
  getAdditionalText() {
    const { additionalText, highlighted } = this.props;

    if (!additionalText) {
      return null;
    }

    return (
      <View style={styles.additional}>
        <Text numberOfLines={1} style={[styles.text, highlighted ? styles.highlighted : null]}>
          {additionalText}
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

  getRightRectangle() {
    if (this.props.rightIcon) {
      return <Icon name={this.props.rightIcon} color="#aeafb3" size={16} />;
    }

    if (this.props.rightText) {
      return <Text style={[styles.text, styles.rightText]}>{this.props.rightText}</Text>;
    }

    return null;
  }

  render() {
    const { onSelect, mainText, highlighted } = this.props;

    return (
      <TouchableOpacity
        onPress={() => {
          if (onSelect) {
            onSelect();
          }
        }}
      >
        <View style={[styles.outerContainer, highlighted ? styles.highlightedContainer : null]}>
          {this.getLeftRectangle()}
          <View style={styles.resultContainer}>
            <Text
              numberOfLines={1}
              style={[gs.bolder, styles.textTitle, highlighted ? styles.highlighted : null]}
            >
              {mainText}
            </Text>
            {this.getAdditionalText()}
          </View>
          {this.getRightRectangle()}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  resultContainer: {
    paddingTop: 3,
    justifyContent: 'center',
    flexGrow: 1,
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
  rightText: {},
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
  highlighted: {
    fontWeight: 'bold',
  },
  highlightedContainer: {
    backgroundColor: '#222327',
    paddingLeft: 5,
    paddingRight: 5,
  },
});
