import { TabNavigator, StackNavigator } from 'react-navigation';

import { SearchNavigator } from '@nav/tab-search';
import { BrowseNavigator } from '@nav/tab-browse';
import { HomeNavigator } from '@nav/tab-home';
import { LibraryScreen } from '@screens/lib';
import { AboutScreen } from '@screens/about';
import { LoginMainScreen } from '@screens/login-main';
import { LoginAddressScreen } from '@screens/login-address';
import { LoginCredentialsScreen } from '@screens/login-credentials';
import { LoginSuccessScreen } from '@screens/login-success';
import { LoginBarcodeScreen } from '@screens/login-barcode';
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

export const LoggedUserNavigator = TabNavigator({
    Home: { screen: HomeNavigator, },
    Browse: { screen: BrowseNavigator },
    Search: { screen: SearchNavigator },
    Library: { screen: LibraryScreen },
    About: { screen: AboutScreen },
}, navOptions);

export const HttpmsNavigator = StackNavigator({
    LoginMain: { screen: LoginMainScreen },
    LoginAddress: { screen: LoginAddressScreen },
    LoginCredentials: { screen: LoginCredentialsScreen },
    LoginBarcode: { screen: LoginBarcodeScreen },
    LoginSuccess: { screen: LoginSuccessScreen },
    LoggedUser: { screen: LoggedUserNavigator },
}, {
    initialRouteName: 'LoginMain',
    headerMode: 'none',
});

const mainParams = HttpmsNavigator.router.getActionForPathAndParams('LoginMain');
const initialRootState = HttpmsNavigator.router.getStateForAction(mainParams);

export const navRootReducer = (state = initialRootState, action) => {
    const nextState = HttpmsNavigator.router.getStateForAction(action, state);

    return nextState || state;
};
