import React from 'react';
import { AppRegistry, AsyncStorage, Platform } from 'react-native';
import { TabNavigator, addNavigationHelpers } from 'react-navigation';
import { HomeScreen } from './screens/home';
import { BrowseScreen } from './screens/browse';
import { SearchScreen } from './screens/search';
import { LibraryScreen } from './screens/lib';
import { AboutScreen } from './screens/about';
import TabBarBottom from './screens/common/TabBarBottom';
import { TABBAR_HEIGHT } from './screens/common/footer';
import { Loader } from './screens/common/loader';
import { playingReducer } from './reducers/playing';
import { playerReducer } from './reducers/player';
import { progressReducer } from './reducers/progress';
import { searchReducer } from './reducers/search';
import { settingsReducer } from './reducers/settings';

import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/constants';
import MusicControl from 'react-native-music-control';
import { restorePlayingState } from './actions/playing';

const Sound = require('react-native-sound');

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
    player: playerReducer,
    search: searchReducer,
    settings: settingsReducer,
    progress: progressReducer,
});

const rehydratedReducer = (state = {}, action) => {
    switch (action.type) {
        case REHYDRATE:
            const incoming = action.payload.myReducer;

            if (incoming) {
                return {
                    ...state,
                    ...incoming,
                };
            }
        default:
            return appReducer(state, action);
    }
};

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
}

const AppWithNavigationState = connect(mapStateToProps)(App);

const store = createStore(
    rehydratedReducer,
    applyMiddleware(
        thunkMiddleware
    ),
    compose(
        autoRehydrate()
    )
);

class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rehydrated: false,
            store,
        };

        Sound.setCategory('Playback');

        MusicControl.enableBackgroundMode(true);
        MusicControl.enableControl('play', true);
        MusicControl.enableControl('pause', true);
        MusicControl.enableControl('stop', false);
        MusicControl.enableControl('nextTrack', false);
        MusicControl.enableControl('previousTrack', false);
        MusicControl.enableControl('seekForward', false);
        MusicControl.enableControl('seekBackward', false);
    }

    componentWillMount() {
        persistStore(
            store,
            {
                storage: AsyncStorage,
                debounce: 1000,
            },
            () => {
                this.setState({ rehydrated: true });
                store.dispatch(restorePlayingState());
            }
        );
    }

    render() {
        if (!this.state.rehydrated) {
            if (Platform.OS === 'android') {
                return null;
            }

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
