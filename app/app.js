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
import { libraryReducer } from './reducers/library';

import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/constants';
import MediaControl from './common/media-control-shim';
import { restorePlayingState } from './actions/playing';
import { restoreLibrary } from './actions/library';

const Sound = require('react-native-sound');

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
    library: libraryReducer,
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

    componentWillMount() {
        // Fix hidden nav bug with otuside of redux changes
        for (let ind = 0; ind < this.props.nav.routes.length; ind += 1) {
            if (this.props.nav.routes[ind].params) {
                this.props.nav.routes[ind].params.translateY = 0;
            }
        }
    }

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

        MediaControl.enableBackgroundMode(true);
        MediaControl.enableControl('play', true);
        MediaControl.enableControl('pause', true);
        MediaControl.enableControl('stop', false);
        MediaControl.enableControl('nextTrack', false);
        MediaControl.enableControl('previousTrack', false);
        MediaControl.enableControl('seek', true);
        MediaControl.enableControl('seekForward', true);
        MediaControl.enableControl('seekBackward', true);
    }

    componentWillMount() {
        persistStore(
            store,
            {
                storage: AsyncStorage,
                debounce: 1000,
            },
            () => {
                store.dispatch(restorePlayingState());
                this.setState({ rehydrated: true });
                store.dispatch(restoreLibrary());
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
