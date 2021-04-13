import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AlbumScreen } from '@screens/album';
import { ArtistScreen } from '@screens/artist';
import { BrowseScreen } from '@screens/browse';
import { BrowseArtistsScreen } from '@screens/browse-artists';
import { BrowseAlbumsScreen } from '@screens/browse-albums';
import { BrowseSongsScreen } from '@screens/browse-songs';

const Stack = createStackNavigator();

export function BrowseNavigator() {
  return (
    <Stack.Navigator initialRouteName="BrowseMain" headerMode="none">
      <Stack.Screen name="SearchAlbum" component={AlbumScreen} />
      <Stack.Screen name="SearchArtist" component={ArtistScreen} />
      <Stack.Screen name="BrowseMain" component={BrowseScreen} />
      <Stack.Screen name="BrowseArtists" component={BrowseArtistsScreen} />
      <Stack.Screen name="BrowseAlbums" component={BrowseAlbumsScreen} />
      <Stack.Screen name="BrowseSongs" component={BrowseSongsScreen} />
    </Stack.Navigator>
  );
}
