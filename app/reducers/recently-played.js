
import { constrainedRecencyBuffer } from '@components/domash';

const initialState = {

    // Unordered collections of albums and objects. The actual order is preserved in the
    // albums and artists arrays which contain keys for the albumsObjects and artistsObjects
    // collections.
    albumsObjects: {},
    artistsObjects: {},

    // The albums and artists arrays contain only comparable objects which would yied themselves
    // to strict comparison (===). They are then used as keys for tine albumsObjects and
    // artistsObjects.
    albums: [],
    artists: [],
};

export const recentlyPlayedReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_RECENTLY_PLAYED:
            const albumsObjectsCopy = { ...state.albumsObjects };
            const artistsObjectsCopy = { ...state.artistsObjects };

            albumsObjectsCopy[action.album.album_id] = action.album;
            artistsObjectsCopy[action.artist.artist] = action.artist;

            const albums = constrainedRecencyBuffer(state.albums, action.album.album_id, 10);
            const artists = constrainedRecencyBuffer(state.artists, action.artist.artist, 10);
            const albumsObjects = {};
            const artistsObjects = {};

            albums.forEach((albumID) => {
                albumsObjects[albumID] = albumsObjectsCopy[albumID];
            });

            artists.forEach((artist) => {
                artistsObjects[artist] = artistsObjectsCopy[artist];
            });

            return {
                ...state,
                albums,
                artists,
                albumsObjects,
                artistsObjects,
            };

        default:
            return state;
    }
};

export const ADD_TO_RECENTLY_PLAYED = 'RecentlyPlayed/Add';
