import base64 from 'base-64';
import RNFetchBlob from 'react-native-fetch-blob';

export class HttpmsService {
    constructor(settings) {
        this.settings = settings;
    }

    getSearchURL(searchText) {
        return `${this.settings.hostAddress}/search/${encodeURIComponent(searchText)}`;
    }

    getSearchRequest(searchText) {
        return this.getRequestByURL(this.getSearchURL(searchText))
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
        return `${this.settings.hostAddress}/album/${e(albumID)}/artwork`;
    }

    addressFromURI(uri) {
        const noSlashes = uri.replace(/^\/+/, '');

        return `${this.settings.hostAddress}/${noSlashes}`;
    }
}
