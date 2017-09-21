import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet
} from 'react-native';

import PlaylistItem from '@components/playlist-item';

export default class PlayList extends Component {


    renderItems() {
        const { circle } = this.props;

        return this.props.items.map((a, i) => {
            return (
                <PlaylistItem
                    circle={circle}
                    source={a.source}
                    followers={a.followers}
                    title={a.name}
                    key={i}
                />
            );
        });

    }
    render() {
        const { title } = this.props;

        return (
            <View style={styles.container}>
                <View>
                    <Text style={styles.title}>{title}</Text>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    >
                        {this.renderItems()}
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: 74,
        paddingBottom: 6
    },

    title: {
        alignSelf: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
    }
});