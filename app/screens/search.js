/**
 * Created by ggoma on 12/23/16.
 */
import React from 'react';
import { Text, TextInput, StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Screen } from './screen';
import { CreateTabIcon, CreateTabLabel } from './common/tab-bar';
import Header from './common/header';
import { connect } from 'react-redux';
import { SearchResults } from './search-results';
import _ from 'lodash';

import { HttpmsService } from '../common/httpms-service';
import { RESULTS_FETCHED, START_SEARCH } from '../reducers/search';

class SearchRenderer extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: CreateTabLabel('Search'),
        tabBarIcon: CreateTabIcon('ios-search'),
    });

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.navigation.state.key == "Search";
    }

    componentDidMount() {
        this.refs.searchBox.setNativeProps({value: this.props.search.query});
        console.log(this.refs.searchBox);
    }

    handleSearchChange = _.debounce((text) => {
        const httpms = new HttpmsService(this.props.settings);

        this.props.dispatch({
            type: START_SEARCH,
            query: text,
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
            });
        });        
    }, 500)

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
                        onChangeText={this.handleSearchChange}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        ref="searchBox"
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
                    <SearchResults />
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
        height: (Platform.OS == 'ios') ? 66 : 74,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: (Platform.OS == 'ios') ? 66 : 74,
    }
});

const mapStateToProps = (state) => ({
    search: state.search,
    settings: state.settings,
});

export const SearchScreen = connect(mapStateToProps)(SearchRenderer);
