import {
    RECENT_ARTISTS_REFRESHED,
    START_REFRESHING_ARTISTS,
    STOPPED_REFRESHING_ARTISTS,
} from '@reducers/recent-artists';
import { HttpmsService } from '@components/httpms-service';

export const refreshRecentArtists = () => {
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
            type: START_REFRESHING_ARTISTS,
        });

        const req = httpms.getRecentArtistsRequest()

        Promise.race([
            fetch(req.url, {
              method: req.method,
              headers: req.headers,
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
                type: RECENT_ARTISTS_REFRESHED,
                artists: responseJson.data,
            });
        })
        .catch((error) => {
            dispatch({
                type: STOPPED_REFRESHING_ARTISTS,
            });

            console.error('Error while refreshing recently added artists', error);
        });
    };
};
