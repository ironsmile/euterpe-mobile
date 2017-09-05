import React from 'react';
import { StackNavigator } from 'react-navigation';
import { AlbumScreen } from '@screens/album';
import { ArtistScreen } from '@screens/artist';
import { BrowseScreen } from '@screens/browse';
import { BrowseArtistsScreen } from '@screens/browse-artists';
import { BrowseSongsScreen } from '@screens/browse-songs';
import { CreateTabIcon, CreateTabLabel } from '@screens/common/tab-bar';

const BrowseNavigatorConfig = StackNavigator({
    SearchAlbum: { screen: AlbumScreen },
    SearchArtist: { screen: ArtistScreen },
    BrowseMain: { screen: BrowseScreen },
    BrowseArtists: { screen: BrowseArtistsScreen },
    BrowseSongs: { screen: BrowseSongsScreen },
}, {
    initialRouteName: 'BrowseMain',
    headerMode: 'none',
});

export class BrowseNavigator extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: CreateTabLabel('Browse'),
        tabBarIcon: CreateTabIcon('ios-albums'),
    });

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.navigation.state.key == "Browse";
    }

  render() {
    return (
        <BrowseNavigatorConfig
            screenProps={{ rootNavigation: this.props.navigation }}
        />
    );
  }
}
