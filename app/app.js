import { AppRegistry } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { HomeScreen } from './screens/home';
import { BrowseScreen } from './screens/browse';
import { SearchScreen } from './screens/search';
import { LibraryScreen } from './screens/lib';
import { AboutScreen } from './screens/about';
import { hs } from './styles/global';
import TabBarBottom from './screens/common/TabBarBottom';
import { TABBAR_HEIGHT } from './screens/common/footer';

const HttpmsApp = TabNavigator({
    Home: { screen: HomeScreen, },
    Browse: { screen: BrowseScreen },
    Search: { screen: SearchScreen },
    Library: { screen: LibraryScreen },
    About: { screen: AboutScreen },
}, {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    tabBarComponent: TabBarBottom,
    tabBarOptions: {
      activeTintColor: 'white',
      inactiveTintColor: '#bdbec2',
      upperCaseLabel: false,
      showIcon: true,
      style: {
        backgroundColor: '#222327',
        height: TABBAR_HEIGHT,
      },
    },
});

AppRegistry.registerComponent('httpms', () => HttpmsApp);
