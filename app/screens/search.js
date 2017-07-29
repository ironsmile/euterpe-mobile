/**
 * Created by ggoma on 12/23/16.
 */
import React from 'react';
import { Text, TextInput, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Screen } from './screen';
import { CreateTabIcon, CreateTabLabel } from './common/tab-bar';
import Header from './common/header';
import { connect } from 'react-redux';
import { SearchReults } from './search-results';
import _ from 'lodash';

import { HttpmsService } from '../common/httpms-service';
import { RESULTS_FETCHED, START_SEARCH } from '../reducers/search';

class SearchRenderer extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: CreateTabLabel('Search'),
        tabBarIcon: CreateTabIcon('ios-search'),
    });

    handleSearchChange(text) {
        const httpms = new HttpmsService(this.props.settings);

        this.props.dispatch({
            type: START_SEARCH
        });

        fetch(httpms.getSearchURL(text), {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...httpms.getAuthCredsHeader()
          },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            // !TODO: some validation checking
            this.props.dispatch({
                type: RESULTS_FETCHED,
                results: responseJson,
                query: text,
            });
        });        
    }

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
                        onChangeText={_.debounce((text) => {
                            this.handleSearchChange(text);
                        }, 500)}
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
                    <SearchReults />
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
        flex: 1,
        flexDirection: 'column',
        paddingTop: 66,
    }
});

const mapStateToProps = (state) => ({
    search: state.search,
    settings: state.settings,
});

export const SearchScreen = connect(mapStateToProps)(SearchRenderer);
