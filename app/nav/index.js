import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import { CreateTabIcon, CreateTabLabel } from '@screens/common/tab-bar';
// import TabBarBottom from '@screens/common/TabBarBottom';

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

export function LoggedUserNavigator() {
    return (
        <Tabs.Navigator
            tabBarPosition="bottom"
            // tabBarComponent={TabBarBottom}
            animationEnabled={false}
            swipeEnabled={false}
            tabBarOptions={{
                keyboardHidesTabBar: true,
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
            }}
        >
            <Tabs.Screen
                name="Home"
                component={HomeNavigator}
                options={{
                    tabBarLabel: CreateTabLabel('Home'),
                    tabBarIcon: CreateTabIcon('ios-home'),
                }}
            />
            <Tabs.Screen
                name="Browse"
                component={BrowseNavigator}
                options={{
                    tabBarLabel: CreateTabLabel('Browse'),
                    tabBarIcon: CreateTabIcon('ios-albums'),
                }}
            />
            <Tabs.Screen
                name="Search"
                component={SearchNavigator}
                options={{
                    tabBarLabel: CreateTabLabel('Search'),
                    tabBarIcon: CreateTabIcon('ios-search'),
                }}
            />
            <Tabs.Screen
                name="Library"
                component={LibraryScreen}
                options={{
                    tabBarLabel: CreateTabLabel('Library'),
                    tabBarIcon: CreateTabIcon('ios-book'),
                }}
            />
            <Tabs.Screen
                name="About"
                component={AboutScreen}
                options={{
                    tabBarLabel: CreateTabLabel('About'),
                    tabBarIcon: CreateTabIcon('ios-information-circle'),
                }}
            />
        </Tabs.Navigator>
    );
}

export function LoginFlowNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="LoginMain"
            headerMode="none"
        >
            <Stack.Screen
                name="LoginMain"
                component={LoginMainScreen}
            />
            <Stack.Screen
                name="LoginAddress"
                component={LoginAddressScreen}
            />
            <Stack.Screen
                name="LoginCredentials"
                component={LoginCredentialsScreen}
            />
            <Stack.Screen
                name="LoginBarcode"
                component={LoginBarcodeScreen}
            />
            <Stack.Screen
                name="LoginSuccess"
                component={LoginSuccessScreen}
            />
        </Stack.Navigator>
    )
}

export function HttpmsNavigator({ loggedIn }) {
    return (
        <Stack.Navigator
            headerMode="none"
        >
            {loggedIn ? (
                <Stack.Screen
                    name="LoggedUser"
                    component={LoggedUserNavigator}
                />
            ) : (
                <Stack.Screen
                    name="LoginFlow"
                    component={LoginFlowNavigator}
                />
            )}
        </Stack.Navigator>
    );
}
