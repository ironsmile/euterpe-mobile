import {
    RECENT_ALBUMS_REFRESHED,
    START_REFRESHING_ALBUMS,
    STOPPED_REFRESHING_ALBUMS,
} from '@reducers/recent-albums';
import { HttpmsService } from '@components/httpms-service';

export const refreshRecentAlbums = () => {
    return (dispatch, getState) => {
        const state = getState();
        const { lastFetched } = state.recentArtists;

        const now = Date.now();

        if (now - lastFetched < 60 * 60 * 1000) {
            return;
        }

        const { settings } = state;
        const httpms = new HttpmsService(settings);

        dispatch({
            type: START_REFRESHING_ALBUMS,
        });

        Promise.race([
            fetch(httpms.getRecentAlbumsURL(), {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...httpms.getAuthCredsHeader()
              },
            }),
            new Promise((resolve, reject) => {
                setTimeout(() => reject(new Error('Request timed out')), 15000);
            }),
        ])
        .then((response) => {
            if (response.status !== 200) {
                throw response;
            }

            return response.json();
        })
        .then((responseJson) => {
            // !TODO: some validation checking
            dispatch({
                type: RECENT_ALBUMS_REFRESHED,
                albums: responseJson.data,
            });
        })
        .catch((error) => {
            dispatch({
                type: STOPPED_REFRESHING_ALBUMS,
            });

            console.error('Error while refreshing recently added albums', error);
        });
    };
};
