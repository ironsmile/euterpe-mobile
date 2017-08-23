import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Images from '@assets/images';
import D from '@screens/common/dimensions';

export class ArtistSmall extends React.PureComponent {
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
                            style={[
                                styles.resultRowImage,
                                styles.resultCircularImage,
                            ]}
                            source={Images.unknownArtist}
                        />
                    </View>
                    <View style={styles.resultContainer}>
                        <Text
                            numberOfLines={1}
                            style={styles.textTitle}
                        >
                            {this.props.artist}
                        </Text>
                        <Icon name="ios-arrow-forward" color="#aeafb3" size={16} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    resultContainer: {
        paddingTop: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: D.width - 60,
        paddingLeft: 5,
    },
    text: {
        fontSize: 12,
        color: '#aeafb3',
    },
    textTitle: {
        color: 'white',
        fontWeight: '500',
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
    resultCircularImage: {
        borderRadius: 20,
    },
});
