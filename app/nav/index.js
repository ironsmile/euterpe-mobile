import { TabNavigator, StackNavigator, addNavigationHelpers } from 'react-navigation';
import { SearchNavigator } from '@nav/tab-search';
import { HomeScreen } from '@screens/home';
import { BrowseScreen } from '@screens/browse';
import { LibraryScreen } from '@screens/lib';
import { AboutScreen } from '@screens/about';
import { TABBAR_HEIGHT } from '@screens/common/footer';
import TabBarBottom from '@screens/common/TabBarBottom';

const navOptions = {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    tabBarComponent: TabBarBottom,
    swipeEnabled: false,
    tabBarOptions: {
        activeTintColor: 'white',
        inactiveTintColor: '#bdbec2',
        upperCaseLabel: false,
        showIcon: true,
        style: {
            backgroundColor: '#222327',
            height: TABBAR_HEIGHT,
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
        },
    },
};

export const HttpmsApp = TabNavigator({
    Home: { screen: HomeScreen, },
    Browse: { screen: BrowseScreen },
    Search: { screen: SearchNavigator },
    Library: { screen: LibraryScreen },
    About: { screen: AboutScreen },
}, navOptions);

const homeParams = HttpmsApp.router.getActionForPathAndParams('Home');
const initialRootState = HttpmsApp.router.getStateForAction(homeParams);

export const navRootReducer = (state = initialRootState, action) => {
    const nextState = HttpmsApp.router.getStateForAction(action, state);

    return nextState || state;
};
