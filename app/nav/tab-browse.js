import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { AlbumScreen } from '@screens/album';
import { ArtistScreen } from '@screens/artist';
import { BrowseScreen } from '@screens/browse';
import { BrowseArtistsScreen } from '@screens/browse-artists';
import { BrowseAlbumsScreen } from '@screens/browse-albums';
import { BrowseSongsScreen } from '@screens/browse-songs';
import { CreateTabIcon, CreateTabLabel } from '@screens/common/tab-bar';

export const  BrowseNavigator = createStackNavigator({
    SearchAlbum: AlbumScreen,
    SearchArtist: ArtistScreen,
    BrowseMain: BrowseScreen,
    BrowseArtists: BrowseArtistsScreen,
    BrowseAlbums: BrowseAlbumsScreen,
    BrowseSongs: BrowseSongsScreen,
}, {
    initialRouteName: 'BrowseMain',
    headerMode: 'none',
    navigationOptions: ({ navigation }) => ({
        tabBarLabel: CreateTabLabel('Browse'),
        tabBarIcon: CreateTabIcon('ios-albums'),
    }),
});
