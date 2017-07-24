import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export class Loader extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator color='white' />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
    },
});
