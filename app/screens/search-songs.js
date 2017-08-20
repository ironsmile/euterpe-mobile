import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import { Screen } from '@screens/screen';
import { SongsList } from '@components/songs-list';
import { setPlaylist, setTrack } from '@actions/playing';
import Header from '@screens/common/header';

class SearchSongsRenderer extends React.PureComponent {
    getHeader() {
        return (
            <Header
                title={`"${this.props.search.query.toUpperCase()}" IN SONGS`}
                onBackButton={() => {
                    this.props.navigation.goBack();
                }}
            />
        );
    }

    render() {
        return (
            <Screen
                navigation={this.props.navigation}
                header={this.getHeader()}
            >
                <SongsList
                    headerText="Songs"
                    avoidHeader={true}
                    data={this.props.search.results}
                    onPressItem={(index) => {
                        const playlist = [this.props.search.results[index]];

                        this.props.dispatch(setPlaylist(playlist));
                        this.props.dispatch(setTrack(0));
                    }}
                />
            </Screen>
        );
    }
}

const mapStateToProps = (state) => ({
    search: state.search,
});

export const SearchSongs = connect(mapStateToProps)(SearchSongsRenderer);