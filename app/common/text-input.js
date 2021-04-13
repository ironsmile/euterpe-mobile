import React from 'react';
import { TextInput as RNTextInput, StyleSheet } from 'react-native';

export class TextInput extends React.PureComponent {
  focus() {
    this.rnInput.focus();
  }

  blur() {
    this.rnInput.blur();
  }

  clear() {
    this.rnInput.clear();
  }

  isFocused() {
    return this.rnInput.isFocused();
  }

  render() {
    return (
      <RNTextInput
        ref={(ref) => (this.rnInput = ref)}
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        underlineColorAndroid="rgba(0,0,0,0)"
        keyboardAppearance="dark"
        maxLength={256}
        selectTextOnFocus={true}
        placeholderTextColor="#aeafb3"
        selectionColor="#7e97fc"
        {...this.props}
      />
    );
  }
}

const styles = StyleSheet.create({
  input: {
    color: 'white',
    backgroundColor: '#46474A',
    borderRadius: 6,
    width: '85%',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 20,
  },
});
