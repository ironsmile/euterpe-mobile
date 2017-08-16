/**
 * Created by ggoma on 12/22/16.
 */
import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet
} from 'react-native';
import Header from '../common/header';
import PlayList from '../common/playlist';
import img from '../common/imgs';
import { FOOTER_HEIGHT } from '../common/footer';
import { gs } from '../../styles/global';

export default class Landing extends Component {

    state = {
        playlists: this.generatePlaylists(img, 5)
    };

    title = [
        'Just For You',
        'Recently Played',
        'Inspired by your Recent Listening',
        'New Music Friday!'
    ];

    generatePlaylists(array, size) {
        let results = [];
        while (array.length) {
            results.push(array.splice(0, size));
        }
        return results;
    }

    renderPlaylists() {
        return this.state.playlists.map((playlist, i) => {
            if(i == 0) return <PlayList title={this.title[i]} items={playlist} key={i} circle/>
            return (
                <PlayList title={this.title[i]} items={playlist} key={i}/>
            )
        })

    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    {this.renderPlaylists()}
                </ScrollView>
                {/*for the gap*/}
                <View style={{height: FOOTER_HEIGHT}}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
