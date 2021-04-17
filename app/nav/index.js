import React from 'react';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SearchNavigator } from '@nav/tab-search';
import { BrowseNavigator } from '@nav/tab-browse';
import { HomeNavigator } from '@nav/tab-home';
import { HttpmsBottomTabView } from '@nav/bottom-tab-bar';
import { LibraryScreen } from '@screens/lib';
import { AboutScreen } from '@screens/about';
import { LoginMainScreen } from '@screens/login-main';
import { LoginAddressScreen } from '@screens/login-address';
import { LoginCredentialsScreen } from '@screens/login-credentials';
import { LoginSuccessScreen } from '@screens/login-success';
import { LoginBarcodeScreen } from '@screens/login-barcode';
import { TABBAR_HEIGHT } from '@screens/common/footer';
import { CreateTabIcon, CreateTabLabel } from '@screens/common/tab-bar';

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

function LoggedUserNavigatorView({ showFooter }) {
  return (
    <Tabs.Navigator
      tabBar={HttpmsBottomTabView}
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
          tabBarVisible: !showFooter,
          tabBarLabel: CreateTabLabel('Home'),
          tabBarIcon: CreateTabIcon('home'),
        }}
      />
      <Tabs.Screen
        name="Browse"
        component={BrowseNavigator}
        options={{
          tabBarVisible: !showFooter,
          tabBarLabel: CreateTabLabel('Browse'),
          tabBarIcon: CreateTabIcon('albums'),
        }}
      />
      <Tabs.Screen
        name="Search"
        component={SearchNavigator}
        options={{
          tabBarVisible: !showFooter,
          tabBarLabel: CreateTabLabel('Search'),
          tabBarIcon: CreateTabIcon('search'),
        }}
      />
      <Tabs.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          tabBarVisible: !showFooter,
          tabBarLabel: CreateTabLabel('Library'),
          tabBarIcon: CreateTabIcon('book'),
        }}
      />
      <Tabs.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarVisible: !showFooter,
          tabBarLabel: CreateTabLabel('About'),
          tabBarIcon: CreateTabIcon('information-circle'),
        }}
      />
    </Tabs.Navigator>
  );
}

export const LoggedUserNavigator = connect((state) => ({
  showFooter: state.footer.shown,
}))(LoggedUserNavigatorView);

export function LoginFlowNavigator() {
  return (
    <Stack.Navigator initialRouteName="LoginMain" headerMode="none">
      <Stack.Screen name="LoginMain" component={LoginMainScreen} />
      <Stack.Screen name="LoginAddress" component={LoginAddressScreen} />
      <Stack.Screen name="LoginCredentials" component={LoginCredentialsScreen} />
      <Stack.Screen name="LoginBarcode" component={LoginBarcodeScreen} />
      <Stack.Screen name="LoginSuccess" component={LoginSuccessScreen} />
    </Stack.Navigator>
  );
}

export function HttpmsNavigator({ loggedIn }) {
  return (
    <Stack.Navigator headerMode="none">
      {loggedIn ? (
        <Stack.Screen name="LoggedUser" component={LoggedUserNavigator} />
      ) : (
        <Stack.Screen name="LoginFlow" component={LoginFlowNavigator} />
      )}
    </Stack.Navigator>
  );
}
