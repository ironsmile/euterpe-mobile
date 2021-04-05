import { createStackNavigator } from 'react-navigation-stack';
import { HomeScreen } from '@screens/home';
import { AlbumScreen } from '@screens/album';
import { ArtistScreen } from '@screens/artist';
import { CreateTabIcon, CreateTabLabel } from '@screens/common/tab-bar';

export const HomeNavigator = createStackNavigator({
    SearchAlbum: AlbumScreen,
    SearchArtist: ArtistScreen,
    HomeMain: HomeScreen,
}, {
    initialRouteName: 'HomeMain',
    headerMode: 'none',
    navigationOptions: ({ navigation }) => ({
        tabBarLabel: CreateTabLabel('Home'),
        tabBarIcon: CreateTabIcon('ios-home'),
    }),
});
