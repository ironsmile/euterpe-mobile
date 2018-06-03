import React from 'react';
import {
    StyleSheet,
    Image,
} from 'react-native';

import Images from '@assets/images';
import { SmallClickable } from '@components/small-clickable';

export class AlbumSmall extends React.PureComponent {

    getAdditionalText() {
        let text = this.props.album.artist;

        if (this.props.withSongsCount === true) {
            text = `${this.props.album.songsCount} songs`;
        }

        return text;
    }

    getAlbumImage() {
        return (
            <Image
                style={styles.resultRowImage}
                defaultSource={Images.unknownAlbum}
                source={{uri: this.props.artwork}}
            />
        );
    }

    render() {
        return (
            <SmallClickable
                onSelect={this.props.onSelect}
                mainText={this.props.album.album}
                additionalText={this.getAdditionalText()}
                leftRectangle={this.getAlbumImage()}
                rightIcon="ios-arrow-forward"
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
