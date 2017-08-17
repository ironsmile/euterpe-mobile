/**
 * Created by ggoma on 12/23/16.
 */
import React from 'react';
import {
    Text,
    TextInput,
    StyleSheet,
    View,
    TouchableOpacity,
    Platform,
    Keyboard
} from 'react-native';
import { Screen } from './screen';
import { CreateTabIcon, CreateTabLabel } from './common/tab-bar';
import Header from './common/header';
import { connect } from 'react-redux';
import { SearchResults } from '../common/search-results';
import { RecentSearches } from '../common/recent-searches';
import _ from 'lodash';
import DropdownAlert from 'react-native-dropdownalert'

import { HttpmsService } from '../common/httpms-service';
import {
    setSearchQuery,
    resultsFetched,
    startSearch,
    hideActivityIndicator,
    showActivityIndicator,
    clearRecentSearches,
    clearSearchResults,
} from '../actions/search';

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
        this.props.dispatch(setSearchQuery(text));
        this.searchForText(text);
    }

    searchForText = _.debounce((text) => {
        if (text.length === 0) {
            this.props.dispatch(clearSearchResults());
            return;
        }

        if (text.length <= 2) {
            return;
        }

        if (!this.props.settings.hostAddress) {
            this.dropdown.alertWithType(
                'error',
                'No HTTPMS server selected',
                'Go to "Library" and add an HTTPMS server for usage.'
            );
            return;
        }

        const httpms = new HttpmsService(this.props.settings);

        this.props.dispatch(startSearch(text));

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
            this.props.dispatch(resultsFetched(responseJson));
        })
        .catch((error) => {
            this.props.dispatch(hideActivityIndicator());
            this._onError(error);
        });
    }, 1000)

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
        let cancelButton = null;

        if (this.props.search.query) {
            cancelButton = (
                <TouchableOpacity
                    onPress={() =>{
                        this.handleSearchChange("");
                    }}
                >
                    <View style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </View>
                </TouchableOpacity>
            );
        }

        return (
            <Header style={styles.header}>
                <View style={styles.searchContainer}>
                    <TextInput
                        placeholder="Search"
                        style={styles.search}
                        returnKeyType="done"
                        autoCorrect={false}
                        autoCapitalize="none"
                        value={this.props.search.query}
                        onChangeText={this.handleSearchChange}
                        onSubmitEditing={Keyboard.dismiss}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        keyboardAppearance="dark"
                        ref={(ref) => {
                            this.searchInput = ref;
                        }}
                    ></TextInput>
                    {cancelButton}
                </View>
            </Header>
        );
    }

    getSearchBody() {
        if (this.props.search.showResults && this.props.search.query) {
            return (
                <SearchResults
                    onError={this._onError.bind(this)}
                />
            );
        }

        return (
            <RecentSearches
                searchClicked={(text) => {
                    this.props.dispatch(showActivityIndicator());
                    this.handleSearchChange(text);
                    this.searchInput.focus();
                }}
                onClearSearchesPress={() => {
                    this.props.dispatch(clearRecentSearches());
                }}
            />
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
                        {this.getSearchBody()}
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
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    search: {
        backgroundColor: 'white',
        borderRadius: 6,
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1,
    },
    header: {
        height: (Platform.OS == 'ios') ? 66 : 74,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: (Platform.OS == 'ios') ? 66 : 74,
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 12,
    },
    cancelButton: {
        height: 24,
        paddingLeft: 10,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    }
});

const mapStateToProps = (state) => ({
    search: state.search,
    settings: state.settings,
});

export const SearchScreen = connect(mapStateToProps)(SearchRenderer);
