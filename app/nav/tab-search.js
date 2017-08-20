import React from 'react';
import { StackNavigator} from 'react-navigation';
import { AlbumScreen } from '@screens/album';
import { ArtistScreen } from '@screens/artist';
import { SearchScreen } from '@screens/search';
import { SearchArtists } from '@screens/search-artists';
import { SearchAlbums } from '@screens/search-albums';
import { SearchSongs } from '@screens/search-songs';
import { CreateTabIcon, CreateTabLabel } from '@screens/common/tab-bar';

const SearchNavigatorConfig = StackNavigator({
    Results: { screen: SearchScreen },
    SearchAlbum: { screen: AlbumScreen },
    SearchArtist: { screen: ArtistScreen },
    ArtistsResults: { screen: SearchArtists },
    AlbumsResults: { screen: SearchAlbums },
    SongsResults: { screen: SearchSongs },
}, {
    initialRouteName: 'Results',
    headerMode: 'none',
});

export class SearchNavigator extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: CreateTabLabel('Search'),
        tabBarIcon: CreateTabIcon('ios-search'),
    });

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.navigation.state.key == "Search";
    }

  render() {
    return (
        <SearchNavigatorConfig />
    );
  }
}
