import React from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';

import { HttpmsService } from '@components/httpms-service';
import { Helpful } from '@components/helpful';
import { Screen } from '@screens/screen';
import Header from '@screens/common/header';
import { AlbumsList } from '@components/albums-list';

class BrowseAlbumsScreenRenderer extends React.Component {
    constructor(props) {
        super(props);

        const httpms = new HttpmsService(this.props.settings);

        this.state = {
            isLoading: true,
            loadingMoreResults: false,
            errorLoading: false,
            errorObj: null,
            albums: [],
            nextPage: httpms.getBrowseAlbumsURL(),
            httpms,
        };

        this._mounted = false;
    }

    componentWillMount() {
        this.getNextAlbumsPage();
    }

    componentDidMount() {
        this._mounted = true;
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    getNextAlbumsPage() {
        if (!this.state.nextPage) {
            return;
        }

        if (this.state.loadingMoreResults) {
            return;
        }

        this.setState({
            loadingMoreResults: true,
        });

        this.fetchJob = fetch(this.state.nextPage, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...this.state.httpms.getAuthCredsHeader()
          },
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
                nextPage = this.state.httpms.addressFromURI(responseJson.next);
            }

            this.setState({
                albums: this.state.albums.concat(responseJson.data),
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
                errorObj: error,
            });

            console.error('Error while GETting artists browsing data', error);
        });
    }

    getHeader() {
        return (
            <Header
                title="ALL ALBUMS"
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
        this.getNextAlbumsPage();
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
                <AlbumsList
                    avoidHeader={true}
                    albums={this.state.albums}
                    onPressItem={(album) => {
                        this.props.navigation.navigate(
                            'SearchAlbum',
                            { album }
                        );
                    }}
                    onEndReachedThreshold={0.2}
                    onEndReached={this.endReached.bind(this)}
                    showLoadingIndicator={this.state.loadingMoreResults}
                    httpms={this.state.httpms}
                />
            </View>
        );
    }

    renderError() {
        return (
            <Helpful
                iconName="warning"
                title="Error Loading Albums"
                firstLine="Getting albums failed due to network error."
                secondLine={this.state.errorObj.toString()}
            />
        );
    }

    render() {
        return (
            <Screen
                header={this.getHeader()}
                navigation={this.props.navigation}
            >
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
        flexDirection: 'column'
    },
});

const mapStateToProps = (state) => ({
    settings: state.settings,
});

export const BrowseAlbumsScreen = connect(mapStateToProps)(BrowseAlbumsScreenRenderer);
