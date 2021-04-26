import React from 'react';
import { StyleSheet, Image, ImageBackground } from 'react-native';

import Images from '@assets/images';
import { SmallClickable } from '@components/small-clickable';
import { httpms } from '@components/httpms-service';

export class ArtistSmall extends React.PureComponent {
  getArtistImage() {
    const { artist_id } = this.props;
    const imageStyle = [styles.resultRowImage, styles.resultCircularImage];

    if (!artist_id) {
      return <Image style={imageStyle} source={Images.unknownArtist} />;
    }

    return (
      <ImageBackground
        source={Images.unknownArtist}
        imageStyle={imageStyle}
        style={{
          width: styles.resultRowImage.width,
          height: styles.resultRowImage.height,
        }}
      >
        <Image
          style={imageStyle}
          source={{ uri: httpms.getArtistImageURL(artist_id, { size: 'small' }) }}
        />
      </ImageBackground>
    );
  }

  render() {
    const { onSelect, artist } = this.props;

    return (
      <SmallClickable
        onSelect={onSelect}
        mainText={artist}
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
