/**
 * Created by ggoma on 12/23/16.
 */
import React from 'react';
import { Text, TextInput, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Screen } from './screen';
import { CreateTabIcon, CreateTabLabel } from './common/tab-bar';
import Header from './common/header';
import { connect } from 'react-redux';

import { SELECT_TRACK, STOP } from '../reducers/playing';
import Images from '@assets/images';

class SearchRenderer extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: CreateTabLabel('Search'),
        tabBarIcon: CreateTabIcon('ios-search'),
    });

    getSearchHeader() {
        return (
            <Header style={styles.header}>
                <View style={styles.searchContainer}>
                    <TextInput
                        placeholder="Search"
                        style={styles.search}
                        returnKeyType="search"
                        autoCorrect={false}
                        autoCapitalize="none"
                    ></TextInput>
                </View>
            </Header>
        );
    }

    render() {
        return (
            <Screen
                title='SEARCH'
                navigation={this.props.navigation}
                header={this.getSearchHeader()}
            >
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => {
                        this.props.dispatch({
                            type: SELECT_TRACK,
                            track: {
                                title: 'Awesome Track',
                                artist: 'Heaviest Metal',
                                image: Images.coverImage3,
                            },
                        });
                    }}>
                        <View style={{backgroundColor: 'blue'}}>
                            <Text>Show</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this.props.dispatch({
                            type: STOP,
                        })
                    }}>
                        <View style={{backgroundColor: 'blue'}}>
                            <Text>Hide</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Screen>
        )
    }
}

const styles = StyleSheet.create({
    searchContainer: {
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 8,
    },
    search: {
        backgroundColor: 'white',
        borderRadius: 6,
        width: '100%',
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 10,
        paddingRight: 10,
    },
    header: {
        height: 66,
    },
    container: {
        paddingTop: 66,
    }
});

const mapStateToProps = (state) => ({
    nowPlaying: state.playing
});

export const SearchScreen = connect(mapStateToProps)(SearchRenderer);
