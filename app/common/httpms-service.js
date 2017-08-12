import base64 from 'base-64';
import RNFetchBlob from 'react-native-fetch-blob';

export class HttpmsService {
    constructor(settings) {
        this.settings = settings;
        this.downloading = null;
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

    getTrackURL(trackID) {
        return `${this.settings.hostAddress}/file/${trackID}`;
    }

    async downloadTrack(track, errorHandler) {
        const dirs = RNFetchBlob.fs.dirs;
        const filePath = `${dirs.DocumentDir}/${track.id}.mp3`;

        const fileExists = await RNFetchBlob.fs.exists(filePath).then((exist) => {
            return exist;
        }).catch((error) => {
            if (errorHandler) {
                errorHandler(error);
            }
            return false;
        });

        if (fileExists) {
            return filePath;
        }

        if (this.downloading) {
            this.downloading.cancel();
        }

        this.downloading = RNFetchBlob.config({
            path: filePath,
        }).fetch(
            'GET',
            this.getTrackURL(track.id),
            {
                ...this.getAuthCredsHeader(),
            }
        );

        const songRes = await this.downloading.catch((error) => {
            if (errorHandler) {
                errorHandler(error);
            }
            throw error;
        })

        return songRes.path();
    }
}
