/**
 * Created by ggoma on 12/23/16.
 */
import React, {Component} from 'react';
import {
    Animated,
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

import D from './dimensions';
import Icon from 'react-native-vector-icons/Ionicons';

export default class tabBarNavigation extends Component {
    state = {
        selected: 0,
        translateY: new Animated.Value(0)
    };

    details = ['Home', 'Browse', 'Search', 'Library', 'About'];
    icons = ['ios-home', 'ios-albums', 'ios-search', 'ios-book', 'ios-information-circle'];

    renderIcons() {
        return this.details.map((item, i) => {
            const color = this.state.selected == i ? 'white' : '#bdbec2';
            const name = this.state.selected == i ? this.icons[i] : this.icons[i] + '-outline';
            const fontWeight = this.state.selected == i ? 'bold' : undefined;
            return (
                <TouchableOpacity onPress={() => this.setState({selected: i})} key={i}>
                    <View style={styles.tab_item} >
                        <Icon name={name} color={color} size={24}/>
                        <Text style={[styles.text, {color, fontWeight}]}>{item}</Text>
                    </View>
                </TouchableOpacity>
            )
        })
    }

    setHeight(h) {
        // console.log('setting height:', h);
        this.state.translateY.setValue(Math.abs((h/10) - 56));

    }

    hide() {
        Animated.timing(
            this.state.translateY,
            {toValue: 56}
        ).start();

    }

    show() {
        Animated.timing(
            this.state.translateY,
            {toValue: 0}
        ).start();

    }


    render() {
        const {translateY} = this.state;
        return (
            <Animated.View style={[styles.container, {transform: [{translateY}]}]}>
                {this.renderIcons()}
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position:'absolute',
        borderTopColor: '#211f20',
        borderTopWidth: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: D.width,
        bottom: 0,
        height: 56,
        backgroundColor: '#222327'
    },

    tab_item: {
        alignItems: 'center',
        width: 56,
    },

    text: {
        fontSize: 10,
    }
})