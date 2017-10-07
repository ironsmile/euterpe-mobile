import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import D from './dimensions';
import { PlatformIcon } from '../../common/platform-icon';

export const headerHeight = 54;

export default (props) => {

    if (props.children) {
        return (
            <View style={[styles.container, props.style]}>
                {props.children}
            </View>
        );
    }

    if (!props.onBackButton) {
        return (
            <View style={[styles.container, props.style]}>
                <Text
                    style={[styles.text, styles.bottomMargin, props.textStyle]}
                    numberOfLines={1}
                >
                    {props.title}
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, props.style]}>
            <View style={styles.withBackButton}>
                <TouchableOpacity
                    onPress={props.onBackButton}
                >
                    <View style={styles.backButtonContainer}>
                        <PlatformIcon platform="arrow-back" color="white" size={28} />
                    </View>
                </TouchableOpacity>
                <View style={styles.backButtonTitleContainer}>
                    <Text
                        style={[styles.text, props.textStyle]}
                        numberOfLines={1}
                    >
                        {props.title}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(27,27,27,.9)',
        // backgroundColor: 'green',
        height: headerHeight,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    text: {
        fontWeight: '500',
        color: 'white',
    },

    bottomMargin: {
        marginBottom: 5,
    },

    withBackButton: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        // backgroundColor: 'yellow',
    },

    backButtonContainer: {
        width: 32,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
    },

    backButtonTitleContainer: {
        width: D.width - 64,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'blue',
    },
});
