import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '@screens/home';
import { AlbumScreen } from '@screens/album';
import { ArtistScreen } from '@screens/artist';
import { CreateTabIcon, CreateTabLabel } from '@screens/common/tab-bar';

const Stack = createStackNavigator();

export function HomeNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="HomeMain"
            headerMode="none"
            options={{
                tabBarLabel: CreateTabLabel('Home'),
                tabBarIcon: CreateTabIcon('ios-home'),
            }}
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
                name="HomeMain"
                component={HomeScreen}
            />
        </Stack.Navigator>
    );
}
