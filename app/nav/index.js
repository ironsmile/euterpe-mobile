import { TabNavigator } from 'react-navigation';
import { SearchNavigator } from '@nav/tab-search';
import { BrowseNavigator } from '@nav/tab-browse';
import { HomeNavigator } from '@nav/tab-home';
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

export const HttpmsNavigator = TabNavigator({
    Home: { screen: HomeNavigator, },
    Browse: { screen: BrowseNavigator },
    Search: { screen: SearchNavigator },
    Library: { screen: LibraryScreen },
    About: { screen: AboutScreen },
}, navOptions);

const homeParams = HttpmsNavigator.router.getActionForPathAndParams('Home');
const initialRootState = HttpmsNavigator.router.getStateForAction(homeParams);

export const navRootReducer = (state = initialRootState, action) => {
    const nextState = HttpmsNavigator.router.getStateForAction(action, state);

    return nextState || state;
};
