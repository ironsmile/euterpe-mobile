import base64 from 'base-64';

class HttpmsService {
  constructor() {
    this.store = null;
  }

  setStore(store) {
    this.store = store;
  }

  getState() {
    return this.store.getState();
  }

  getSearchURL(searchText) {
    const { settings } = this.getState();
    return `${settings.hostAddress}/v1/search?q=${encodeURIComponent(searchText)}`;
  }

  getSearchRequest(searchText) {
    return this.getRequestByURL(this.getSearchURL(searchText));
  }

  // getAuthCredsHeader preserves comaptibility with old installations where
  // settings contains username and password for basic authentication.
  getAuthCredsHeader() {
    const { settings } = this.getState();

    if (!settings.username && !settings.token) {
      return {};
    }

    if (settings.token) {
      return {
        Authorization: `Bearer ${settings.token}`,
      };
    }

    const encoded = base64.encode(`${settings.username}:${settings.password}`);

    return {
      Authorization: `Basic ${encoded}`,
    };
  }

  getSongURL(songID) {
    const { settings } = this.getState();
    return `${settings.hostAddress}/v1/file/${songID}`;
  }

  getSongRequest(songID) {
    return {
      url: this.getSongURL(songID),
      method: 'GET',
      headers: {
        ...this.getAuthCredsHeader(),
      },
    };
  }

  getShareURL(song) {
    const { settings } = this.getState();
    const e = encodeURIComponent;

    return `${settings.hostAddress}/?q=${e(song.title)}&tr=${e(song.id)}&al=${e(
      song.album_id
    )}&at=${e(song.artist)}`;
  }

  getRequestByURL(url) {
    return {
      url: url,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...this.getAuthCredsHeader(),
      },
    };
  }

  getBrowseArtistsURL() {
    const { settings } = this.getState();
    return `${settings.hostAddress}/v1/browse?by=artist&per-page=20`;
  }

  getBrowseAlbumsURL() {
    const { settings } = this.getState();
    return `${settings.hostAddress}/v1/browse?by=album&per-page=20`;
  }

  getRecentArtistsURL() {
    const { settings } = this.getState();
    return `${settings.hostAddress}/v1/browse?by=artist&per-page=5&order=desc&order-by=id`;
  }

  getRecentArtistsRequest() {
    return this.getRequestByURL(this.getRecentArtistsURL());
  }

  getRecentAlbumsURL() {
    const { settings } = this.getState();
    return `${settings.hostAddress}/v1/browse?by=album&per-page=5&order=desc&order-by=id`;
  }

  getRecentAlbumsRequest() {
    return this.getRequestByURL(this.getRecentAlbumsURL());
  }

  getAlbumArtworkURL(albumID) {
    const e = encodeURIComponent;
    const { settings } = this.getState();
    const url = `${settings.hostAddress}/v1/album/${e(albumID)}/artwork`;

    if (settings.token) {
      return `${url}?token=${e(settings.token)}`;
    }

    return url;
  }

  getArtistImageURL(artistID) {
    const e = encodeURIComponent;
    const { settings } = this.getState();
    const url = `${settings.hostAddress}/v1/artist/${e(artistID)}/image`;

    if (settings.token) {
      return `${url}?token=${e(settings.token)}`;
    }

    return url;
  }

  getCheckSettingsRequest() {
    return this.getRequestByURL(this.getRecentAlbumsURL());
  }

  getTokenRequest() {
    const { settings } = this.getState();

    return {
      url: `${settings.hostAddress}/v1/login/token/`,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: settings.username,
        password: settings.password,
      }),
    };
  }

  getRegisterTokenRequest() {
    const { settings } = this.getState();

    return {
      url: `${settings.hostAddress}/v1/register/token/`,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...this.getAuthCredsHeader(),
      },
    };
  }

  addressFromURI(uri) {
    const noSlashes = uri.replace(/^\/+/, '');
    const { settings } = this.getState();

    return `${settings.hostAddress}/${noSlashes}`;
  }
}

export const httpms = new HttpmsService();
