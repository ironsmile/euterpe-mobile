import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AlbumScreen } from '@screens/album';
import { ArtistScreen } from '@screens/artist';
import { SearchScreen } from '@screens/search';
import { SearchArtists } from '@screens/search-artists';
import { SearchAlbums } from '@screens/search-albums';
import { SearchSongs } from '@screens/search-songs';
import { CreateTabIcon, CreateTabLabel } from '@screens/common/tab-bar';

const Stack = createStackNavigator();

export function SearchNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Results"
            headerMode="none"
        >
            <Stack.Screen
                name="SearchAlbum"
                component={AlbumScreen}
            />
            <Stack.Screen
                name="SearchArtist"
                component={ArtistScreen}
            />
            <Stack.Screen
                name="Results"
                component={SearchScreen}
            />
            <Stack.Screen
                name="ArtistsResults"
                component={SearchArtists}
            />
            <Stack.Screen
                name="AlbumsResults"
                component={SearchAlbums}
            />
            <Stack.Screen
                name="SongsResults"
                component={SearchSongs}
            />
        </Stack.Navigator>
    );
}

