/**
 * Created by ggoma on 12/22/16.
 */
import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

export default (props) => {

    if (props.children) {
        return (
            <View style={[styles.container, props.style]}>
                {props.children}
            </View>
        );
    }

    return (
        <View style={[styles.container, props.style]}>
            <Text style={[styles.text, props.textStyle]}>{props.title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position:'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(27,27,27,.9)',
        height: 44,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    text: {
        fontWeight: '500',
        color: 'white',
        marginBottom: 5,
    }
});