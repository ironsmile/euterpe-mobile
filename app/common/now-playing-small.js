import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Image,
    ActivityIndicator,
} from 'react-native';
import Images from '@assets/images';
import D from '../screens/common/dimensions';


export class NowPlaying extends React.Component {

    renderImageArea() {
        if (this.props.loading) {
            return <ActivityIndicator style={styles.image} />;
        }

        return (
            <Image
                style={styles.image}
                source={Images.unknownAlbum}
            />
        );
    }

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <View style={styles.imageContainer}>
                    {this.renderImageArea()}
                </View>
                <View style={styles.textContainer}>
                    <Text
                        numberOfLines={1}
                        style={styles.textTitle}
                    >
                        {this.props.song.title}
                    </Text>
                    <View style={styles.additional}>
                        <Text
                            style={styles.text}
                            numberOfLines={1}
                        >
                            {this.props.song.artist},
                        </Text>
                        <Text> </Text>
                        <Text
                            style={styles.text}
                            numberOfLines={1}
                        >
                            {this.props.song.album}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 2,
        paddingBottom: 2,
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    image: {
        width: 40,
        height: 40,
        alignSelf: 'center',
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
    textContainer: {
        paddingTop: 3,
        justifyContent: 'center',
        paddingLeft: 10,
        width: D.width - 50,
    },
});
