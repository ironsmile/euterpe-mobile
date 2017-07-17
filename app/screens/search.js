/**
 * Created by ggoma on 12/23/16.
 */
import React from 'react';
import { Text, TextInput, StyleSheet, View } from 'react-native';
import { Screen } from './screen';
import { CreateTabIcon, CreateTabLabel } from './common/tab-bar';
import Header from './common/header';

export class SearchScreen extends React.Component {

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
                <Text style={{color: 'white', marginTop: 50}}>Search Screen</Text>
            </Screen>
        )
    }
}

var styles = StyleSheet.create({
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
    }
});
