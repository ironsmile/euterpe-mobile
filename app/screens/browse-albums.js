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
    }

    componentWillMount() {
        this.getNextAlbumsPage();
    }

    getNextAlbumsPage() {
        if (!this.state.nextPage) {
            return;
        }

        this.setState({
            loadingMoreResults: true,
        });

        fetch(this.state.nextPage, {
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
            this.setState({
                albums: this.state.albums.concat(responseJson.data),
                isLoading: false,
                loadingMoreResults: false,
                nextPage: this.state.httpms.addressFromURI(responseJson.next),
                errorLoading: false,
            });
        })
        .catch((error) => {
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
                title="BROWSE ALBUMS"
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
                    onEndReachedThreshold={0.5}
                    onEndReached={this.endReached.bind(this)}
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
                secondLine={this.state.errorObj}
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
