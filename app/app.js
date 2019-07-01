import React from 'react';
import { AppRegistry, AsyncStorage, Platform } from 'react-native';
import { addNavigationHelpers } from 'react-navigation';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/constants';
import { connect, Provider } from 'react-redux';
import MediaControl from './common/media-control-shim';
import thunkMiddleware from 'redux-thunk';

import { Loader } from './screens/common/loader';
import { playingReducer } from './reducers/playing';
import { playerReducer } from './reducers/player';
import { progressReducer } from './reducers/progress';
import { searchReducer } from './reducers/search';
import { settingsReducer } from './reducers/settings';
import { libraryReducer } from './reducers/library';
import { recentArtistsReducer } from './reducers/recent-artists';
import { recentAlbumsReducer } from './reducers/recent-albums';
import { recentlyPlayedReducer } from './reducers/recently-played';
import { restorePlayingState } from './actions/playing';
import { setupLibrary } from './actions/library';
import { HttpmsNavigator, navRootReducer } from '@nav';
import { httpms } from '@components/httpms-service';


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

const mapStateToPropsRoot = (state) => ({
    nav: state.navRoot,
    settings: state.settings,
});

class App extends React.Component {
    render() {
        return (
            <HttpmsNavigator
                navigation={addNavigationHelpers({
                    dispatch: this.props.dispatch,
                    state: this.props.nav,
                })}
            />
        );
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

    componentWillMount() {
        persistStore(
            store,
            {
                storage: AsyncStorage,
                debounce: 1000,
            },
            () => {
                httpms.setStore(store);
                store.dispatch(restorePlayingState());
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
                <AppWithNavigationState />
            </Provider>
        );
    }
}

AppRegistry.registerComponent('httpms', () => Root);
