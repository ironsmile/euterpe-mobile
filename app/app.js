import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { HomeScreen } from './screens/home';
import { hs } from './styles/global';

const HttpmsApp = StackNavigator({
    Home: { screen: HomeScreen },
}, {
    navigationOptions: {
        headerStyle: hs.bg,
        headerTitleStyle: {...hs.font, alignSelf: 'center'},
    },
});

AppRegistry.registerComponent('httpms', () => HttpmsApp);
