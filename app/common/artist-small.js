import React from 'react';
import { StyleSheet, Image } from 'react-native';

import Images from '@assets/images';
import { SmallClickable } from '@components/small-clickable';

export class ArtistSmall extends React.PureComponent {
  getArtistImage() {
    return (
      <Image
        style={[styles.resultRowImage, styles.resultCircularImage]}
        source={Images.unknownArtist}
      />
    );
  }

  render() {
    return (
      <SmallClickable
        onSelect={this.props.onSelect}
        mainText={this.props.artist}
        leftRectangle={this.getArtistImage()}
        rightIcon="chevron-forward"
      />
    );
  }
}

const styles = StyleSheet.create({
  resultRowImage: {
    width: 40,
    height: 40,
    alignSelf: 'center',
  },
  resultCircularImage: {
    borderRadius: 20,
  },
});
