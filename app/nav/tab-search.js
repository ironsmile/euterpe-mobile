import React from 'react';
import { StackNavigator} from 'react-navigation';
import { AlbumScreen } from '@screens/album';
import { SearchScreen } from '@screens/search';
import { SearchAlbums } from '@screens/search-albums';
import { CreateTabIcon, CreateTabLabel } from '@screens/common/tab-bar';

const SearchNavigatorConfig = StackNavigator({
    Results: { screen: SearchScreen },
    Album: { screen: AlbumScreen },
    AlbumsResults: { screen: SearchAlbums },
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
