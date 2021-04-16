import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

import { httpms } from '@components/httpms-service';
import { Helpful } from '@components/helpful';
import { Screen } from '@screens/screen';
import Header from '@screens/common/header';
import { ArtistsList } from '@components/artists-list';
import { errorToMessage } from '@helpers/errors';

class BrowseArtistsScreenRenderer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      loadingMoreResults: false,
      errorLoading: false,
      errorMessage: null,
      artists: [],
      nextPage: httpms.getBrowseArtistsURL(),
    };
  }

  componentDidMount() {
    this._mounted = true;
    this.getNextArtistsPage();
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  getNextArtistsPage() {
    if (!this.state.nextPage) {
      return;
    }

    if (this.state.loadingMoreResults) {
      return;
    }

    this.setState({
      loadingMoreResults: true,
    });

    const req = httpms.getRequestByURL(this.state.nextPage);

    fetch(req.url, {
      method: req.method,
      headers: req.headers,
    })
      .then((response) => {
        if (response.status !== 200) {
          throw response;
        }

        return response.json();
      })
      .then((responseJson) => {
        if (!this._mounted) {
          return;
        }

        let nextPage = null;

        if (responseJson.next) {
          nextPage = httpms.addressFromURI(responseJson.next);
        }

        this.setState({
          artists: this.state.artists.concat(responseJson.data),
          isLoading: false,
          loadingMoreResults: false,
          nextPage: nextPage,
          errorLoading: false,
        });
      })
      .catch((error) => {
        if (!this._mounted) {
          return;
        }

        this.setState({
          errorLoading: true,
          isLoading: false,
          loadingMoreResults: false,
          errorMessage: errorToMessage(error),
        });

        console.error('Error while GETting artists browsing data', error);
      });
  }

  getHeader() {
    return (
      <Header
        title="ALL ARTISTS"
        onBackButton={() => {
          this.props.navigation.goBack();
        }}
      />
    );
  }

  endReached(info) {
    if (!this.state.nextPage) {
      return;
    }
    this.getNextArtistsPage();
  }

  renderBody() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      );
    }

    if (this.state.errorLoading) {
      return this.renderError();
    }

    return (
      <View style={styles.container}>
        <ArtistsList
          avoidHeader={true}
          data={this.state.artists}
          onPressItem={(artist) => {
            this.props.navigation.navigate('SearchArtist', { artist });
          }}
          onEndReachedThreshold={0.2}
          onEndReached={this.endReached.bind(this)}
          showLoadingIndicator={this.state.loadingMoreResults}
        />
      </View>
    );
  }

  renderError() {
    return (
      <Helpful
        iconName="warning"
        title="Error Loading Artists"
        firstLine="Getting artists failed due to network error."
        secondLine={this.state.errorMessage}
      />
    );
  }

  render() {
    return (
      <Screen header={this.getHeader()} navigation={this.props.navigation}>
        {this.renderBody()}
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    height: '100%',
  },
  loadingContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
});

export const BrowseArtistsScreen = connect()(BrowseArtistsScreenRenderer);
