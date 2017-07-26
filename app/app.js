import React from 'react';
import { AppRegistry, AppState, AsyncStorage, Text } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { HomeScreen } from './screens/home';
import { BrowseScreen } from './screens/browse';
import { SearchScreen } from './screens/search';
import { LibraryScreen } from './screens/lib';
import { AboutScreen } from './screens/about';
import { hs } from './styles/global';
import TabBarBottom from './screens/common/TabBarBottom';
import { TABBAR_HEIGHT } from './screens/common/footer';
import { Loader } from './screens/common/loader';
import { playingReducer } from './reducers/playing';

import { addNavigationHelpers } from 'react-navigation';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux';
import { persistStore, autoRehydrate } from 'redux-persist'
import { REHYDRATE } from 'redux-persist/constants'


const navOptions = {
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
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
        },
    },
};

const HttpmsApp = TabNavigator({
    Home: { screen: HomeScreen, },
    Browse: { screen: BrowseScreen },
    Search: { screen: SearchScreen },
    Library: { screen: LibraryScreen },
    About: { screen: AboutScreen },
}, navOptions);

const homeParams = HttpmsApp.router.getActionForPathAndParams('Home');
const initialState = HttpmsApp.router.getStateForAction(homeParams);

const navReducer = (state = initialState, action) => {
    const nextState = HttpmsApp.router.getStateForAction(action, state);

    // Simply return the original `state` if `nextState` is null or undefined.
    return nextState || state;
};

const appReducer = combineReducers({
    nav: navReducer,
    playing: playingReducer,
});

const rehydratedReducer = (state = {}, action) => {
    switch (action.type) {
        case REHYDRATE:
            var incoming = action.payload.myReducer
            if (incoming) {
                return {...state, ...incoming}
            }
        default:
            return appReducer(state, action);
    }
}

const mapStateToProps = (state) => ({
    nav: state.nav
});

class App extends React.Component {
  render() {
    return (
        <HttpmsApp
            navigation={addNavigationHelpers({
                dispatch: this.props.dispatch,
                state: this.props.nav,
            })}
        />
    );
  }
};

const AppWithNavigationState = connect(mapStateToProps)(App);

const store = createStore(
    rehydratedReducer,
    undefined,
    compose(
        autoRehydrate() 
    )
);

class Root extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            store: store,
            rehydrated: false,
        }
    }

    componentWillMount() {
        persistStore(
            store,
            {
                storage: AsyncStorage,
                debounce: 1000,
            },
            () => {
                this.setState({rehydrated: true});
            }
        );
    }

    render() {
        if (!this.state.rehydrated) {
            return (<Loader />);
        }

        return (
            <Provider store={this.state.store}>
                <AppWithNavigationState />
            </Provider>
        );
    }
}

AppRegistry.registerComponent('httpms', () => Root);
