import React from 'react';
import { StackNavigator } from 'react-navigation';
import { HomeScreen } from '@screens/home';
import { AlbumScreen } from '@screens/album';
import { ArtistScreen } from '@screens/artist';
import { CreateTabIcon, CreateTabLabel } from '@screens/common/tab-bar';

const HomeNavigatorConfig = StackNavigator({
    SearchAlbum: { screen: AlbumScreen },
    SearchArtist: { screen: ArtistScreen },
    HomeMain: { screen: HomeScreen },
}, {
    initialRouteName: 'HomeMain',
    headerMode: 'none',
});

export class HomeNavigator extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: CreateTabLabel('Home'),
        tabBarIcon: CreateTabIcon('ios-home'),
    });

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.navigation.state.key == "Home";
    }

  render() {
    return (
        <HomeNavigatorConfig
            screenProps={{ rootNavigation: this.props.navigation }}
        />
    );
  }
}
