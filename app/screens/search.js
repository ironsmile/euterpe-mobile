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
import DropdownAlert from 'react-native-dropdownalert'

import { HttpmsService } from '../common/httpms-service';
import {
    RESULTS_FETCHED,
    START_SEARCH,
    HIDE_ACTIVITY_INDICATOR,
    SET_SEARCH_QUERY
} from '../reducers/search';

class SearchRenderer extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: CreateTabLabel('Search'),
        tabBarIcon: CreateTabIcon('ios-search'),
    });

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.navigation.state.key == "Search";
    }

    componentDidMount() {
        //
    }

    handleSearchChange = (text) => {
        this.props.dispatch({
            type: SET_SEARCH_QUERY,
            query: text,
        });
        this.searchForText(text);
    }

    searchForText = _.debounce((text) => {

        if (!this.props.settings.hostAddress) {
            this.dropdown.alertWithType(
                'error',
                'No HTTPMS server selected',
                'Go to "Library" and add an HTTPMS server for usage.'
            );
            return;
        }

        const httpms = new HttpmsService(this.props.settings);

        this.props.dispatch({
            type: START_SEARCH,
            query: text,
        });

        Promise.race([
            fetch(httpms.getSearchURL(text), {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...httpms.getAuthCredsHeader()
              },
            }),
            new Promise(function (resolve, reject) {
                setTimeout(() => reject(new Error('Request timed out')), 15000)
            }),
        ])
        .then((response) => {
            if (response.status !== 200) {
                throw response;
            }
            return response.json();
        })
        .then((responseJson) => {
            // !TODO: some validation checking
            this.props.dispatch({
                type: RESULTS_FETCHED,
                results: responseJson,
            });
        })
        .catch((error) => {
            this.props.dispatch({
                type: HIDE_ACTIVITY_INDICATOR,
            });
            this._onError(error);
        });
    }, 500)

    _onError(error) {
        if (error.status === 401) {
            this.dropdown.alertWithType(
                'error',
                'Wrong Username or Password',
                'Wrong HTTPMS server username or password. Go to Library and correct them.'
            );
        } else if (typeof error === 'string') {
            this.dropdown.alertWithType(
                'error',
                'Playback Error',
                error
            );
        } else if (error.message) {
            this.dropdown.alertWithType(
                'error',
                'General Error',
                error.message
            );
        } else {
            this.dropdown.alertWithType(
                'error',
                'Unknown Error',
                'Contacting the server failed. Try again later.'
            );
        }
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
                        value={this.props.search.query}
                        onChangeText={this.handleSearchChange}
                        onSubmitEditing={() => {
                            this.handleSearchChange(this.props.search.query);
                        }}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        ref="searchBox"
                    ></TextInput>
                </View>
            </Header>
        );
    }

    render() {
        return (
            <View style={{height: '100%', width: '100%'}}>
                <Screen
                    title='SEARCH'
                    navigation={this.props.navigation}
                    header={this.getSearchHeader()}
                >
                    <View style={styles.container}>
                        <SearchResults
                            onNetworkError={this._onError.bind(this)}
                        />
                    </View>
                </Screen>
                <DropdownAlert
                    ref={(ref) => this.dropdown = ref}
                    onClose={(data) => {}}
                    updateStatusBar={false}
                    errorColor="#ea6d6d"
                    closeInterval={30000}
                />
            </View>
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
