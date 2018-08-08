import base64 from 'base-64';

export class HttpmsService {
    constructor(settings) {
        this.settings = settings;
    }

    getSearchURL(searchText) {
        return `${this.settings.hostAddress}/search?q=${encodeURIComponent(searchText)}`;
    }

    getSearchRequest(searchText) {
        return this.getRequestByURL(this.getSearchURL(searchText))
    }

    // getAuthCredsHeader preserves comaptibility with old installations where
    // settings contains username and password for basic authentication.
    getAuthCredsHeader() {
        if (!this.settings.username && !this.settings.token) {
            return {};
        }

        if (this.settings.token) {
            return {
                'Authorization': `Bearer ${this.settings.token}`,
            }
        }

        const encoded = base64.encode(`${this.settings.username}:${this.settings.password}`);

        return {
            'Authorization': `Basic ${encoded}`,
        };
    }

    getSongURL(songID) {
        return `${this.settings.hostAddress}/file/${songID}`;
    }

    getSongRequest(songID) {
        return {
            url: this.getSongURL(songID),
            method: "GET",
            headers: {
                ...this.getAuthCredsHeader(),
            },
        };
    }

    getShareURL(song) {
        const e = encodeURIComponent;

        return `${this.settings.hostAddress}/?q=${e(song.title)}&tr=${e(song.id)}&al=${e(song.album_id)}&at=${e(song.artist)}`;
    }

    getRequestByURL(url) {
        return {
            url: url,
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...this.getAuthCredsHeader(),
            },
        };
    }

    getBrowseArtistsURL() {
        return `${this.settings.hostAddress}/browse/?by=artist&per-page=20`;
    }

    getBrowseAlbumsURL() {
        return `${this.settings.hostAddress}/browse/?by=album&per-page=20`;
    }

    getRecentArtistsURL() {
        return `${this.settings.hostAddress}/browse/?by=artist&per-page=5&order=desc&order-by=id`;
    }

    getRecentArtistsRequest() {
        return this.getRequestByURL(this.getRecentArtistsURL());
    }

    getRecentAlbumsURL() {
        return `${this.settings.hostAddress}/browse/?by=album&per-page=5&order=desc&order-by=id`;
    }

    getRecentAlbumsRequest() {
        return this.getRequestByURL(this.getRecentAlbumsURL());
    }

    getAlbumArtworkURL(albumID) {
        const e = encodeURIComponent;
        const url = `${this.settings.hostAddress}/album/${e(albumID)}/artwork/`;

        if (this.settings.token) {
            return `${url}?token=${e(this.settings.token)}`;
        }

        return url;
    }

    getCheckSettingsRequest() {
        return this.getRequestByURL(this.getRecentAlbumsURL());
    }

    getTokenRequest() {
        return {
            url: `${this.settings.hostAddress}/login/token/`,
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.settings.username,
                password: this.settings.password,
            }),
        };
    }

    getRegisterTokenRequest() {
        return {
            url: `${this.settings.hostAddress}/register/token/`,
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...this.getAuthCredsHeader(),
            },
        };
    }

    addressFromURI(uri) {
        const noSlashes = uri.replace(/^\/+/, '');

        return `${this.settings.hostAddress}/${noSlashes}`;
    }
}
