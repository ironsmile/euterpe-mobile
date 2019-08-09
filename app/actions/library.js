import RNFetchBlob from 'rn-fetch-blob';
import { Platform } from 'react-native';
import {
    CLEANUP_LIBRARY,
    RESET_LIBRARY,
    SONG_USED,
} from '@reducers/library';

import { httpms } from '@components/httpms-service';

let _downloading = null;

export const downloadSong = (song, errorHandler) => {
    // console.log(`downloadSong action creator filer for ${song.id}`);
    return async (dispatch, getState) => {
        const filePath = songFilePath(song.id);

        const fileExists = await RNFetchBlob.fs.exists(filePath).then((exist) => {
            return exist;
        }).catch((error) => {
            if (errorHandler) {
                errorHandler(error);
            }
            return false;
        });

        if (fileExists) {
            // console.log(`Song ${song.id} already saved on disk. Using it.`);
            dispatch(songUsed(song));
            return filePath;
        }

        if (_downloading) {
            _downloading.cancel();
        }

        const req = httpms.getSongRequest(song.id)

        // console.log(`Starging song ${song.id} downloading with RNFetchBlob.`);
        _downloading = RNFetchBlob.config({
            path: filePath,
        }).fetch(
            req.method,
            req.url,
            {
                ...req.headers,
            }
        );

        const songRes = await Promise.race([
            _downloading,
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    _downloading.cancel();
                    reject(new Error('request timed out'));
                }, 15000);
            }),
        ])
        .then((resp) => {
            dispatch(songDownloaded(song));
            return resp;
        }).catch((error) => {
            if (errorHandler) {
                errorHandler(error);
            }
            // console.log(`Downloading ${song.id} failed`, error);
            throw error;
        });

        // console.log(`Song ${song.id} downloaded to ${songRes.path()} and ready for use`);
        return songRes.path();
    }
}


export const songUsed = (song) => ({
    type: SONG_USED,
    song,
});

export const songDownloaded = (song) => {
    return (dispatch, getState) => {
        const state = getState().library;
        let lruLenght = state.lru.length;
        let lru = state.lru.slice(0);

        if (lru.indexOf(song.id) !== -1) {
            dispatch(songUsed(song));
            return;
        }

        while (lruLenght > state.maxAllowedSize - 1) {
            let deletedSongID = lru[lruLenght - 1];
            unlinkSong(deletedSongID);
            lru = lru.slice(0, -1);
            lruLenght -= 1;
        }

        lru = [
            song.id,
            ...lru,
        ];

        dispatch({
            type: RESET_LIBRARY,
            lru,
        });
    }
}

unlinkSong = (songID) => {
    const filePath = songFilePath(songID);

    RNFetchBlob.fs.unlink(filePath)
    .catch((error) => {
        console.error(`Error unlinking song ${songID}`, error);
    });
}

songFilePath = (songID) => {
    return `${RNFetchBlob.fs.dirs.DocumentDir}/${songID}.mp3`;
}

export const setupLibrary = () => {
    return (dispatch, getState) => {
        if (Platform.OS !== 'android') {
            return;
        }

        const { library } = getState();

        // Cleanup the song cache for android platforms since they dont
        // use the JavaScript audio player any more. Hence they cannot
        // use the saved tracks.
        library.lru.forEach((songID) => {
            unlinkSong(songID);
        });
        dispatch({
            type: CLEANUP_LIBRARY,
        });
    }
}
