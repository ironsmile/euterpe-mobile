import React from 'react';
import { View, Image, StyleSheet, ImageBackground } from 'react-native';

export default (props) => {
  const imageStyle = [styles.image, { width: props.width, height: props.height }];

  return (
    <View style={{ width: props.page_width }}>
      <ImageBackground source={props.defaultSource} style={imageStyle}>
        <Image style={imageStyle} source={props.source} />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    margin: 16,
    alignSelf: 'center',
  },
});
