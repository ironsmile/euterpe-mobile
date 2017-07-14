import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { LoginScreen } from './screens/login/login';
import { HomeScreen } from './screens/home/home';
import { SearchScreen } from './screens/search/search';

const HttpmsApp = StackNavigator({
  Home: { screen: HomeScreen },
  Login: { screen: LoginScreen },
  Search: { screen: SearchScreen },
}, {
    initialRouteName: 'Home',
});

AppRegistry.registerComponent('httpms', () => HttpmsApp);
