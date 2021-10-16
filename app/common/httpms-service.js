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
    return this.addressFromURI(`/v1/search?q=${encodeURIComponent(searchText)}`);
  }

  getSearchRequest(searchText) {
    return this.getRequestByURL(this.getSearchURL(searchText));
  }

  // getAuthCredsHeader preserves comaptibility with old installations where
  // settings contains username and password for basic authentication.
  getAuthCredsHeader() {
    const { settings } = this.getState();

    if (!settings.token) {
      return {};
    }

    return {
      Authorization: `Bearer ${settings.token}`,
    };
  }

  getSongURL(songID) {
    return this.addressFromURI(`/v1/file/${songID}`);
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
    const e = encodeURIComponent;

    return this.addressFromURI(
      `/?q=${e(song.title)}&tr=${e(song.id)}&al=${e(song.album_id)}&at=${e(song.artist)}`
    );
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
    return this.addressFromURI('/v1/browse?by=artist&per-page=20');
  }

  getBrowseAlbumsURL() {
    return this.addressFromURI('/v1/browse?by=album&per-page=20');
  }

  getRecentArtistsURL() {
    return this.addressFromURI('/v1/browse?by=artist&per-page=5&order=desc&order-by=id');
  }

  getRecentArtistsRequest() {
    return this.getRequestByURL(this.getRecentArtistsURL());
  }

  getRecentAlbumsURL() {
    return this.addressFromURI('/v1/browse?by=album&per-page=5&order=desc&order-by=id');
  }

  getRecentAlbumsRequest() {
    return this.getRequestByURL(this.getRecentAlbumsURL());
  }

  getAlbumArtworkURL(albumID, { size } = {}) {
    const e = encodeURIComponent;
    const { settings } = this.getState();
    const url = this.addressFromURI(`/v1/album/${e(albumID)}/artwork`);
    let sizeQuery = null;
    if (size === 'small') {
      sizeQuery = 'size=small';
    }

    if (settings.token) {
      const withToken = `${url}?token=${e(settings.token)}`;
      if (sizeQuery) {
        return `${withToken}&${sizeQuery}`;
      }
      return withToken;
    }

    if (sizeQuery) {
      return `${url}?${sizeQuery}`;
    }

    return url;
  }

  getArtistImageURL(artistID, { size } = {}) {
    const e = encodeURIComponent;
    const { settings } = this.getState();
    const url = this.addressFromURI(`/v1/artist/${e(artistID)}/image`);
    let sizeQuery = null;
    if (size === 'small') {
      sizeQuery = 'size=small';
    }

    if (settings.token) {
      const withToken = `${url}?token=${e(settings.token)}`;
      if (sizeQuery) {
        return `${withToken}&${sizeQuery}`;
      }
      return withToken;
    }

    if (sizeQuery) {
      return `${url}?${sizeQuery}`;
    }
    return url;
  }

  getCheckSettingsRequest() {
    return this.getRequestByURL(this.getRecentAlbumsURL());
  }

  getTokenRequest() {
    const { settings } = this.getState();

    return {
      url: this.addressFromURI('/v1/login/token/'),
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
    return {
      url: this.addressFromURI('/v1/register/token/'),
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...this.getAuthCredsHeader(),
      },
    };
  }

  addressFromURI(uri) {
    const { settings } = this.getState();
    const noSlashes = uri.replace(/^\/+/, '');
    const slashlessAddress = settings.hostAddress.replace(/\/+$/, '');

    return `${slashlessAddress}/${noSlashes}`;
  }
}

export const httpms = new HttpmsService();
