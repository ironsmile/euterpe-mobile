import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';

import PlaylistItem from '@components/playlist-item';
import D from '@screens/common/dimensions';

export class PlayList extends Component {

    renderItems() {
        const { circle, isLoading } = this.props;

        if (isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator />
                </View>
            );
        }

        return this.props.items.map((item, ind) => {
            let artwork = this.props.getItemArtwork(item);
            if (typeof artwork == 'string') {
                artwork = {uri: artwork};
            }

            return (
                <TouchableOpacity
                    onPress={() => {
                        if (!this.props.onItemPress) {
                            return;
                        }
                        this.props.onItemPress(item);
                    }}
                    key={ind}
                >
                    <PlaylistItem
                        getItemTitle={this.props.getItemTitle}
                        getItemSubTitle={this.props.getItemSubTitle}
                        circle={circle}
                        defaultSource={this.props.defaultItemSource}
                        source={artwork}
                        item={item}
                    />
                </TouchableOpacity>
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
                        style={styles.horizontalScrollView}
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
        paddingBottom: 6,
    },

    title: {
        alignSelf: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
    },

    loadingContainer: {
        width: D.width,
        height: ((D.width * 4.2) / 10) + 20,
        flexDirection: 'column',
        justifyContent: 'center',
    },

    horizontalScrollView: {
        width: D.width,
    },
});
