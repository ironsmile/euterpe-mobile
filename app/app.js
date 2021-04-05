import React from 'react';
import { AppRegistry, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAppContainer } from 'react-navigation';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/constants';
import { connect, Provider } from 'react-redux';
import MediaControl from './common/media-control-shim';
import thunkMiddleware from 'redux-thunk';
import { enableScreens } from 'react-native-screens';

enableScreens();

import { Loader } from '@screens/common/loader';
import { playingReducer } from '@reducers/playing';
import { playerReducer } from '@reducers/player';
import { progressReducer } from '@reducers/progress';
import { searchReducer } from '@reducers/search';
import { settingsReducer } from '@reducers/settings';
import { libraryReducer } from '@reducers/library';
import { recentArtistsReducer } from '@reducers/recent-artists';
import { recentAlbumsReducer } from '@reducers/recent-albums';
import { recentlyPlayedReducer } from '@reducers/recently-played';
import { restorePlayingState } from '@actions/playing';
import { setupLibrary } from '@actions/library';
import { HttpmsNavigator, navRootReducer, ROUTER_NAVIGATE } from '@nav';
import { httpms } from '@components/httpms-service';
import { errorsReducer } from '@reducers/errors';
import { appendError } from '@actions/errors';
import { ErrorsOverlay } from '@screens/common/errors';


const appReducer = combineReducers({
    navRoot: navRootReducer,
    playing: playingReducer,
    player: playerReducer,
    search: searchReducer,
    settings: settingsReducer,
    progress: progressReducer,
    library: libraryReducer,
    recentArtists: recentArtistsReducer,
    recentAlbums: recentAlbumsReducer,
    recentlyPlayed: recentlyPlayedReducer,
    errors: errorsReducer,
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

let Navigator = createAppContainer(HttpmsNavigator);

const mapStateToPropsRoot = (state) => ({
    nav: state.navRoot,
    errors: state.errors.errors,
});

class App extends React.Component {
    render() {
        if (this.props.errors.length > 0) {
            return <ErrorsOverlay />;
        }

        return (
            <Navigator
                props={this.props}
                persistNavigationState={this._persisteNavigationState}
                loadNavigationState={this._loadNavigationState}
            />
        );
    }

    _persisteNavigationState(navState) {
        console.log("persisted nav state", navState);
        try {
            this.props.dispatch({
                type: ROUTER_NAVIGATE,
                navState
            });
        } catch (e) {
            console.error("persist exception", e);
        }
    }

    _loadNavigationState() {
        return this.props.nav;
    }
}

const AppWithNavigationState = connect(mapStateToPropsRoot)(App);

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

    componentDidMount() {
        persistStore(
            store,
            {
                storage: AsyncStorage,
                debounce: 1000,
            },
            () => {
                httpms.setStore(store);
                store.dispatch(restorePlayingState((error) => {
                    store.dispatch(appendError(error));
                }));
                this.setState({ rehydrated: true });
                store.dispatch(setupLibrary());
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
                <Navigator />
            </Provider>
        );
    }
}

AppRegistry.registerComponent('httpms', () => Root);
