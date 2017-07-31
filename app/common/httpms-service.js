import base64 from 'base-64';

export class HttpmsService {
    constructor(settings) {
        this.settings = settings;
    }

    getSearchURL(searchText) {
        return this.settings.hostAddress + '/search/' +
            encodeURIComponent(searchText);
    }

    getAuthCredsHeader() {
        if (!this.settings.username) {
            return {};
        }

        const encoded = base64.encode(this.settings.username + ':' +
            this.settings.password);

        return {
            'Authorization': 'Basic ' + encoded,
        };
    }

    getTrackURL(trackID) {
        return this.settings.hostAddress + '/file/' + trackID;
    }
}
