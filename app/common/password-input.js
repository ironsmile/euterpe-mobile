import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput } from '@components/text-input';
import { PlatformIcon } from '@components/platform-icon';

export class PasswordInput extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      secureTextEntry: true,
    };
  }

  toggleReveal() {
    this.setState({ secureTextEntry: !this.state.secureTextEntry });
  }

  render() {
    let icon = 'eye-outline';
    if (this.state.secureTextEntry === false) {
      icon = 'eye-off-outline';
    }

    return (
      <View style={styles.searchInputContainer}>
        <TextInput {...this.props} {...this.state} style={styles.passwordInput} />
        <TouchableOpacity onPress={this.toggleReveal.bind(this)} style={styles.eye}>
          <PlatformIcon md={icon} ios={icon} size={16} color="white" />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '85%',
    marginBottom: 20,
    borderRadius: 6,
    backgroundColor: '#46474A',
  },
  passwordInput: {
    color: 'white',
    borderRadius: 6,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    flexGrow: 1,
    flexShrink: 3,
  },
  eye: {
    marginLeft: 10,
    marginRight: 10,
  },
});
