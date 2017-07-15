import React from 'react';
import { gs } from '../../styles/global';
import { Text, View, StyleSheet } from 'react-native';

export class RecentlyPlayed extends React.Component {
    render() {
        return (
            <View style={styles.recentlyPlayed}>
                <Text style={styles.header}>
                    Recently Played
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    recentlyPlayed: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },

    header: {
        ...gs.font,
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },
});
