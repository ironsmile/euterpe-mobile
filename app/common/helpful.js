import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { PlatformIcon } from '@components/platform-icon';

export class Helpful extends React.PureComponent {
  renderIcon() {
    if (this.props.icon) {
      return this.props.icon;
    }

    return <PlatformIcon platform={this.props.iconName} color="#aeafb3" size={128} />;
  }

  render() {
    return (
      <View style={styles.helpfulContainer}>
        {this.renderIcon()}
        <Text style={styles.helpfulHeader} numberOfLines={1}>
          {this.props.title}
        </Text>
        <Text style={styles.helpfulText}>{this.props.firstLine}</Text>
        <Text style={styles.helpfulText}>{this.props.secondLine}</Text>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  helpfulContainer: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  helpfulHeader: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 16,
  },
  helpfulText: {
    color: '#aeafb3',
  },
});
