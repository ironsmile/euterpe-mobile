import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { HomeScreen } from './screens/home';

const HttpmsApp = StackNavigator({
  Home: { screen: HomeScreen },
});

AppRegistry.registerComponent('httpms', () => HomeScreen);
