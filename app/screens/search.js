import React from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Keyboard,
} from 'react-native';
import { Screen } from '@screens/screen';
import Header from '@screens/common/header';
import { connect } from 'react-redux';
import { SearchResults } from '@components/search-results';
import { RecentSearches } from '@components/recent-searches';
import DropdownAlert from 'react-native-dropdownalert';

import { httpms } from '@components/httpms-service';
import {
  setSearchQuery,
  resultsFetched,
  startSearch,
  hideActivityIndicator,
  showActivityIndicator,
  clearRecentSearches,
  clearSearchResults,
} from '@actions/search';
import { gs } from '@styles/global';
import { PlatformIcon } from '@components/platform-icon';

class SearchRenderer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showCancel: false,
      searchValue: this.props.search.query,
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide.bind(this)
    );

    if (Platform.OS !== 'android') {
      this.keyboardWillShowListener = Keyboard.addListener(
        'keyboardWillShow',
        this._keyboardDidShow.bind(this)
      );
      this.keyboardWillHideListener = Keyboard.addListener(
        'keyboardWillHide',
        this._keyboardDidHide.bind(this)
      );
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    if (Platform.OS !== 'android') {
      this.keyboardWillShowListener.remove();
      this.keyboardWillHideListener.remove();
    }
  }

  _keyboardDidShow() {
    this.setState({
      showCancel: true,
    });
  }

  _keyboardDidHide() {
    this.setState({
      showCancel: false,
    });
  }

  handleSearchChange = (text) => {
    this.props.dispatch(setSearchQuery(text));
    this.searchForText(text);
  };

  searchForText = (text) => {
    if (text.length === 0) {
      this.props.dispatch(clearSearchResults());
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

    this.props.dispatch(startSearch(text));

    const req = httpms.getSearchRequest(text);

    Promise.race([
      fetch(req.url, {
        method: req.method,
        headers: req.headers,
      }),
      new Promise(function (resolve, reject) {
        setTimeout(() => reject(new Error('Request timed out')), 15000);
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
  };

  _onError(error) {
    if (error.status === 401) {
      this.dropdown.alertWithType(
        'error',
        'Wrong Username or Password',
        'Wrong HTTPMS server username or password. Go to Library and correct them.'
      );
    } else if (typeof error === 'string') {
      this.dropdown.alertWithType('error', 'Playback Error', error);
    } else if (error.message) {
      this.dropdown.alertWithType('error', 'General Error', error.message);
    } else {
      this.dropdown.alertWithType(
        'error',
        'Unknown Error',
        'Contacting the server failed. Try again later.'
      );
    }
  }

  backToRecentSearches() {
    this.setState({
      searchValue: '',
    });
    this.handleSearchChange('');
  }

  getSearchHeader() {
    let cancelButton = null;

    if (this.state.showCancel) {
      cancelButton = (
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </View>
        </TouchableOpacity>
      );
    }

    let eraseButton = null;

    if (this.state.searchValue && this.state.searchValue.length > 0) {
      eraseButton = (
        <TouchableOpacity onPress={this.backToRecentSearches.bind(this)}>
          <PlatformIcon platform="close-circle" size={16} color="white" />
        </TouchableOpacity>
      );
    }

    return (
      <Header style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              placeholder="Search"
              style={styles.search}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
              defaultValue={this.state.searchValue}
              onSubmitEditing={() => {
                this.handleSearchChange(this.state.searchValue);
                Keyboard.dismiss();
              }}
              onChangeText={(text) => {
                this.setState({
                  searchValue: text,
                });
              }}
              underlineColorAndroid="rgba(0,0,0,0)"
              keyboardAppearance="dark"
              ref={(ref) => {
                this.searchInput = ref;
              }}
              maxLength={256}
              selectTextOnFocus={true}
              placeholderTextColor="#aeafb3"
              selectionColor="#7e97fc"
            />
            {eraseButton}
          </View>
          {cancelButton}
        </View>
      </Header>
    );
  }

  getSearchBody() {
    if (this.props.search.showResults && this.props.search.query) {
      return (
        <SearchResults onError={this._onError.bind(this)} navigation={this.props.navigation} />
      );
    }

    return (
      <RecentSearches
        searchClicked={(text) => {
          this.setState({
            searchValue: text,
          });
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
      <View style={[{ height: '100%', width: '100%' }, gs.bg]}>
        <Screen title="SEARCH" navigation={this.props.navigation} header={this.getSearchHeader()}>
          <View style={styles.container}>{this.getSearchBody()}</View>
        </Screen>
        <DropdownAlert
          ref={(ref) => (this.dropdown = ref)}
          onClose={(data) => {}}
          updateStatusBar={false}
          errorColor="#ea6d6d"
          closeInterval={30000}
        />
      </View>
    );
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
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#46474A',
    borderRadius: 6,
    paddingLeft: 6,
    paddingRight: 6,
    flex: 1,
  },
  search: {
    color: 'white',
    backgroundColor: '#46474A',
    borderRadius: 0,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
  },
  header: {
    height: Platform.OS === 'ios' ? 66 : 74,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: Platform.OS === 'ios' ? 66 : 74,
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
  },
});

const mapStateToProps = (state) => ({
  search: state.search,
  settings: state.settings,
});

export const SearchScreen = connect(mapStateToProps)(SearchRenderer);
