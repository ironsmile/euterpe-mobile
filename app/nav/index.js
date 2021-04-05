import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

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
// import TabBarBottom from '@screens/common/TabBarBottom';

const navOptions = {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    // tabBarComponent: TabBarBottom,
    swipeEnabled: false,
    tabBarOptions: {
        activeTintColor: 'white',
        inactiveTintColor: '#6f7075',
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

export const LoggedUserNavigator = createBottomTabNavigator({
    Home: HomeNavigator,
    Browse: BrowseNavigator,
    Search: SearchNavigator,
    Library: LibraryScreen,
    About: AboutScreen,
}, navOptions);

export const HttpmsNavigator = createStackNavigator({
    LoginMain: LoginMainScreen,
    LoginAddress: LoginAddressScreen,
    LoginCredentials: LoginCredentialsScreen,
    LoginBarcode: LoginBarcodeScreen,
    LoginSuccess: LoginSuccessScreen,
    LoggedUser: LoggedUserNavigator,
}, {
    initialRouteName: 'LoginMain',
    headerMode: 'none',
});

const mainParams = HttpmsNavigator.router.getActionForPathAndParams('LoginMain');
const initialRootState = HttpmsNavigator.router.getStateForAction(mainParams);

export const navRootReducer = (state = initialRootState, action) => {
    switch(action.type) {
        case ROUTER_NAVIGATE:
            const nextState = HttpmsNavigator.router.getStateForAction(
                action.navState, state
            );
            return nextState || state;
        default:
            return state;
    }
};

export const ROUTER_NAVIGATE = 'Navigation/RouterNavigate';
