import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';

import Images from '@assets/images';
import D from '@screens/common/dimensions';

export class AlbumSmall extends React.PureComponent {
    render() {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.onSelect();
                }}
            >
                <View style={styles.resultRowOuterContainer}>
                    <View style={styles.resultRowContainer}>
                        <Image
                            style={styles.resultRowImage}
                            source={Images.unknownAlbum}
                        />
                    </View>
                    <View style={styles.resultContainer}>
                        <Text
                            numberOfLines={1}
                            style={styles.textTitle}
                        >
                            {this.props.album.album}
                        </Text>
                        <View style={styles.additional}>
                            <Text
                                numberOfLines={1}
                                style={styles.text}
                            >
                                {this.props.album.artist}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    resultContainer: {
        paddingTop: 3,
        justifyContent: 'center',
        paddingLeft: 10,
        width: D.width - 50,
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
    resultRowOuterContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 2,
        paddingBottom: 2,
    },
    resultRowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    resultRowImage: {
        width: 40,
        height: 40,
        alignSelf: 'center',
    },
});
