import React from 'react';
import { StyleSheet, Image, ImageBackground } from 'react-native';

import Images from '@assets/images';
import { SmallClickable } from '@components/small-clickable';
import { httpms } from '@components/httpms-service';

export class AlbumSmall extends React.PureComponent {
  getAdditionalText() {
    let text = this.props.album.artist;

    if (this.props.withSongsCount === true) {
      text = `${this.props.album.songsCount} songs`;
    }

    return text;
  }

  getAlbumImage() {
    const albumID = this.props.album.album_id;
    return (
      <ImageBackground source={Images.unknownAlbum} style={styles.resultRowImage}>
        <Image
          style={styles.resultRowImage}
          source={{ uri: httpms.getAlbumArtworkURL(albumID, { size: 'small' }) }}
        />
      </ImageBackground>
    );
  }

  render() {
    return (
      <SmallClickable
        onSelect={this.props.onSelect}
        mainText={this.props.album.album}
        additionalText={this.getAdditionalText()}
        leftRectangle={this.getAlbumImage()}
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
});
