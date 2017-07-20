/**
 * Created by ggoma on 12/23/16.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,

} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
let Ionicons = Icon;


import D from './dimensions';

import CoverFlowItem from './coverflow-item';

export default class CoverFlow extends Component {
    state = {
        play: true,
    };

    renderHeader() {
        return (
            <View style={styles.header}>
                <TouchableOpacity onPress={() => this.props.scrollDown()}>
                    <View style={styles.downArrow}>
                        <Ionicons name='ios-arrow-down' color='white' size={24}/>
                    </View>
                </TouchableOpacity>
                <Text style={styles.playing}>NOW PLAYING</Text>
                <Ionicons name='ios-list' color='white' size={26}/>
            </View>
        )
    }

    renderCoverflow() {
        const width = D.width * 3.2/5,
            height = D.width * 3.2/5;
        const { nowPlaying } = this.props;

        let covers = [];

        if (nowPlaying) {
            covers.push(nowPlaying.image);
        }

        return (
            <ScrollView pagingEnabled={true} horizontal={true}>
                {covers.map((coverImage, i) => (
                    <CoverFlowItem
                        key={i}
                        page_width={D.width}
                        width={width}
                        height={height}
                        source={coverImage}
                    />
                ))}
            </ScrollView>
        )
    }

    renderInfo() {
        const { nowPlaying } = this.props;

        return (
            <View style={styles.infoContainer}>
                <View style={styles.titleContainer}>
                    <Ionicons name='ios-add' color='white' size={24}/>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.title}>{nowPlaying.title}</Text>
                        <Text style={styles.artist}>{nowPlaying.artist}</Text>
                    </View>
                    <Ionicons name='ios-more' color='white' size={24}/>
                </View>
                <View style={styles.progress} />
            </View>
        )
    }

    renderButtons() {
        const {play} = this.state;
        return (
            <View style={styles.buttonContainer}>
                <Ionicons name='ios-shuffle' size={24} color='#c2beb3'/>
                <Ionicons name='ios-skip-backward' size={32} color='white' />
                <TouchableOpacity
                    onPress={() => this.setState({play: !play})}
                    style={[styles.playContainer, play ? {paddingLeft: 8} : {}]}>
                    <Ionicons name={play ? 'ios-play' : 'ios-pause'} style={styles.play}/>
                </TouchableOpacity>
                <Ionicons name='ios-skip-forward' size={32} color='white' />
                <Ionicons name='ios-repeat' size={24} color='#c2beb3'/>

            </View>
        )
    }

    render() {
        if (!this.props.nowPlaying) {
            return null;
        }
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                {this.renderCoverflow()}
                {this.renderInfo()}
                {this.renderButtons()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    downArrow: {
        width: 40,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    header: {
        paddingRight: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 16,
    },

    playing: {
        color: 'white',
        fontWeight: '300',
        fontSize: 12,
        marginBottom: 12
    },

    infoContainer: {

    },

    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 32
    },

    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700'
    },

    artist: {
        color: 'white',
        fontSize: 14,
        fontWeight: '400'
    },


    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 16
    },

    playContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderColor: 'white',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    play: {
        color: 'white',
        backgroundColor:'transparent',
        margin: 16,
        fontSize: 48,
        fontWeight: '800'
    },

    progress: {
        height: 2,
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 16,
        backgroundColor: '#3c3d41'
    },

    text: {
        color: '#429962',
        fontSize: 10,
        marginBottom: 10,
        alignSelf: 'center',
        fontWeight: '300'
    }

});
