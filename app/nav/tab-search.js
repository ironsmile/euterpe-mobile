import { createStackNavigator } from 'react-navigation-stack';
import { AlbumScreen } from '@screens/album';
import { ArtistScreen } from '@screens/artist';
import { SearchScreen } from '@screens/search';
import { SearchArtists } from '@screens/search-artists';
import { SearchAlbums } from '@screens/search-albums';
import { SearchSongs } from '@screens/search-songs';
import { CreateTabIcon, CreateTabLabel } from '@screens/common/tab-bar';

export const SearchNavigator = createStackNavigator({
    Results: SearchScreen,
    SearchAlbum: AlbumScreen,
    SearchArtist: ArtistScreen,
    ArtistsResults: SearchArtists,
    AlbumsResults: SearchAlbums,
    SongsResults: SearchSongs,
}, {
    initialRouteName: 'Results',
    headerMode: 'none',
    navigationOptions: ({ navigation }) => ({
        tabBarLabel: CreateTabLabel('Search'),
        tabBarIcon: CreateTabIcon('ios-search'),
    }),
});
