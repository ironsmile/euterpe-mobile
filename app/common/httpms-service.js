import base64 from 'base-64';
import RNFetchBlob from 'react-native-fetch-blob';

export class HttpmsService {
    constructor(settings) {
        this.settings = settings;
    }

    getSearchURL(searchText) {
        return `${this.settings.hostAddress}/search/${encodeURIComponent(searchText)}`;
    }

    getAuthCredsHeader() {
        if (!this.settings.username) {
            return {};
        }

        const encoded = base64.encode(`${this.settings.username}:${this.settings.password}`);

        return {
            'Authorization': `Basic ${encoded}`,
        };
    }

    getSongURL(songID) {
        return `${this.settings.hostAddress}/file/${songID}`;
    }

    getShareURL(song) {
        const e = encodeURIComponent;

        return `${this.settings.hostAddress}/?q=${e(song.title)}&tr=${e(song.id)}&al=${e(song.album_id)}&at=${e(song.artist)}`;
    }

    getBrowseArtistsURL() {
        return `${this.settings.hostAddress}/browse/?by=artist&per-page=20`;
    }

    getBrowseAlbumsURL() {
        return `${this.settings.hostAddress}/browse/?by=album&per-page=20`;
    }

    addressFromURI(uri) {
        const noSlashes = uri.replace(/^\/+/, '');

        return `${this.settings.hostAddress}/${noSlashes}`;
    }
}
