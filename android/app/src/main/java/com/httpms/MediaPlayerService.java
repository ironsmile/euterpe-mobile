package com.httpms;

import android.app.Service;
import android.app.PendingIntent;
import android.app.Notification;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.MediaPlayer;
import android.media.AudioManager;
import android.media.AudioAttributes;
import android.os.Bundle;
import android.os.ResultReceiver;
import android.os.IBinder;
import android.os.Binder;
import android.widget.Toast;
import android.net.Uri;
import android.util.Log;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class MediaPlayerService extends Service implements MediaPlayer.OnCompletionListener,
      MediaPlayer.OnPreparedListener, MediaPlayer.OnErrorListener,
      MediaPlayer.OnSeekCompleteListener, MediaPlayer.OnInfoListener,
      MediaPlayer.OnBufferingUpdateListener, AudioManager.OnAudioFocusChangeListener {

  private static final String TAG = "MediaPlayerService";
  private boolean debugMode = false;
  private boolean playbackError = false;
  private boolean mediaPlayerPrepared = false;
	private int ONGOING_NOTIFICATION_ID = 42;
  private final IBinder iBinder = new LocalBinder();

  private AudioManager audioManager;
  private MediaPlayer mediaPlayer;
  private String mediaFile;

  private ResultReceiver setTrackResultReceiver;
  private ResultReceiver endTrackResultReceiver;
  private ResultReceiver playResultReceiver;
  private ResultReceiver pauseResultReceiver;
  private ResultReceiver stopResultReceiver;

  // Used to pause/resume MediaPlayer
  private int resumePosition;

	@Override
	public void onCreate() {
		Intent notificationIntent = new Intent(this, MediaPlayerService.class);
		PendingIntent pendingIntent =
				PendingIntent.getActivity(this, 0, notificationIntent, 0);

		Notification notification =
				new Notification.Builder(this)
			.setContentTitle("HTTPMS Media Service")
			.setContentText("music playing in background")
			.setContentIntent(pendingIntent)
			.build();

		startForeground(ONGOING_NOTIFICATION_ID, notification);
    registerBecomingNoisyReceiver();
    registerGetCurrentTimeReceiver();
    registerIsPlayingReceiver();
    registerGetDurationReceiver();
    registerPauseReceiver();
    registerPlayReceiver();
    registerStopReceiver();
    registerSetNewTrackReceiver();
    registerSeekToReceiver();
	}


	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
    try {
      endTrackResultReceiver = intent.getParcelableExtra(
        MediaPlayerModule.ResultReceiver_END_TRACK
      );
      playResultReceiver = intent.getParcelableExtra(
        MediaPlayerModule.ResultReceiver_PLAY
      );
      pauseResultReceiver = intent.getParcelableExtra(
        MediaPlayerModule.ResultReceiver_PAUSE
      );
      stopResultReceiver = intent.getParcelableExtra(
        MediaPlayerModule.ResultReceiver_STOP
      );
      debugMode = intent.getExtras().getBoolean("debugMode");
    } catch (NullPointerException e) {
      String logMsg = "MediaPlayer start null pointer exception: " + e;
      Toast.makeText(this, logMsg, Toast.LENGTH_LONG).show();
      Log.e(TAG, logMsg);
      return START_STICKY;
    }

		// If we get killed, after returning from here, restart
		return START_STICKY;
	}

	@Override
	public void onDestroy() {
    if (debugMode) {
      Toast.makeText(this, "service done", Toast.LENGTH_SHORT).show();
    }

    if (mediaPlayer != null) {
      stopMedia();
      mediaPlayer.reset();
      mediaPlayer.release();
    }
  
    removeAudioFocus();
    unregisterReceiver(becomingNoisyReceiver);
    unregisterReceiver(playReceiver);
    unregisterReceiver(pauseReceiver);
    unregisterReceiver(stopReceiver);
    unregisterReceiver(getCurrentTime);
    unregisterReceiver(getDuration);
    unregisterReceiver(setNewTrackReceiver);
    unregisterReceiver(seekToReceiver);
    unregisterReceiver(isPlayingReceiver);
	}

  public class LocalBinder extends Binder {
    public MediaPlayerService getService() {
      return MediaPlayerService.this;
    }
  }

	@Override
	public IBinder onBind(Intent intent) {
		return iBinder;
	}

  // Broadcast Receivers

  // Becoming noisy receiver
  private BroadcastReceiver becomingNoisyReceiver = new BroadcastReceiver() {
      @Override
      public void onReceive(Context context, Intent intent) {
        // pause audio on ACTION_AUDIO_BECOMING_NOISY
        pauseMedia();
        removeAudioFocus();
        pauseResultReceiver.send(0, null);
    }
  };

  private void registerBecomingNoisyReceiver() {
    // Register after getting audio focus
    IntentFilter intentFilter = new IntentFilter(AudioManager.ACTION_AUDIO_BECOMING_NOISY);
    registerReceiver(becomingNoisyReceiver, intentFilter);
  }

  // Play new file reciever
  private BroadcastReceiver playReceiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      ResultReceiver resultReceiver;

      try {
        resultReceiver = intent.getParcelableExtra(MediaPlayerModule.ResultReceiver_PLAY);
      } catch (NullPointerException e) {
        stopSelf();
        Log.e(TAG, "play null pointer exception: " + e);
        return;
      }

      // Request audio focus
      if (requestAudioFocus() == false) {
        // Could not gain focus
        resultReceiver.send(1, bundlWithError("could not get audio focus"));
        return;
      }

      if (mediaPlayer == null) {
        resultReceiver.send(1, bundlWithError("media player is not created"));
        return;
      }

      playMedia();
      resultReceiver.send(0, null);
    }
  };

  private void registerPlayReceiver() {
    IntentFilter filter = new IntentFilter(MediaPlayerModule.Broadcast_PLAY);
    registerReceiver(playReceiver, filter);
  }

  private BroadcastReceiver setNewTrackReceiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      ResultReceiver resultReceiver;

      try {
        // An audio file is passed to the service through putExtra();
        mediaFile = intent.getExtras().getString("media");
        resultReceiver = intent.getParcelableExtra(MediaPlayerModule.ResultReceiver_SET_TRACK);
      } catch (NullPointerException e) {
        stopSelf();
        Log.e(TAG, "setNewTrack null pointer exception: " + e);
        return;
      }

      if (mediaPlayer != null) {
        stopMedia();
        mediaPlayer.reset();
        mediaPlayer.release();
        mediaPlayer = null;
      }

      initMediaPlayer();
      setTrackResultReceiver = resultReceiver;
    }
  };

  private void registerSetNewTrackReceiver() {
    IntentFilter filter = new IntentFilter(MediaPlayerModule.Broadcast_SET_TRACK);
    registerReceiver(setNewTrackReceiver, filter);
  }

  private BroadcastReceiver pauseReceiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      ResultReceiver resultReceiver;

      try {
        resultReceiver = intent.getParcelableExtra(MediaPlayerModule.ResultReceiver_PAUSE);
      } catch (NullPointerException e) {
        stopSelf();
        Log.e(TAG, "pause null pointer exception: " + e);
        return;
      }

      pauseMedia();
      removeAudioFocus();
      resultReceiver.send(0, null);
    }
  };

  private void registerPauseReceiver() {
    IntentFilter filter = new IntentFilter(MediaPlayerModule.Broadcast_PAUSE);
    registerReceiver(pauseReceiver, filter);
  }

  private BroadcastReceiver stopReceiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      ResultReceiver resultReceiver;

      try {
        resultReceiver = intent.getParcelableExtra(MediaPlayerModule.ResultReceiver_STOP);
      } catch (NullPointerException e) {
        stopSelf();
        Log.e(TAG, "stop null pointer exception: " + e);
        return;
      }

      if (mediaPlayer != null) {
        stopMedia();
      }
      removeAudioFocus();
      resultReceiver.send(0, null);
    }
  };

  private void registerStopReceiver() {
    IntentFilter filter = new IntentFilter(MediaPlayerModule.Broadcast_STOP);
    registerReceiver(stopReceiver, filter);
  }

  private BroadcastReceiver getCurrentTime = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      ResultReceiver resultReceiver;
      try {
        resultReceiver = intent.getParcelableExtra(
          MediaPlayerModule.ResultReceiver_CURRENT_TIME
        );
      } catch (NullPointerException e) {
        stopSelf();
        Log.e(TAG, "getCurrentTime null pointer exception: " + e);
        return;
      }

      Bundle bundle = new Bundle();

      if (mediaPlayer == null) {
        Log.e(TAG, "getCurrentTime called when the player is still null");
        resultReceiver.send(1, bundlWithError("player is still null"));
        return;
      } else if (!mediaPlayerPrepared) {
        Log.e(TAG, "getCurrentTime called during the player is still preparing");
        resultReceiver.send(1, bundlWithError("player is still preparing"));
        return;
      }

      if (mediaPlayer == null || !mediaPlayerPrepared) {        
        bundle.putInt("time", 0);
        bundle.putBoolean("isPlaying", false);
      } else {
        boolean isPlaying = mediaPlayer.isPlaying();
        int pos = mediaPlayer.getCurrentPosition();

        bundle.putInt("time", pos / 1000);
        bundle.putBoolean("isPlaying", isPlaying);
      }

      resultReceiver.send(0, bundle);
    }
  };

  private void registerGetCurrentTimeReceiver() {
    IntentFilter filter = new IntentFilter(MediaPlayerModule.Broadcast_GET_CURRENT_TIME);
    registerReceiver(getCurrentTime, filter);
  }

  private BroadcastReceiver isPlayingReceiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      ResultReceiver resultReceiver;
      try {
        resultReceiver = intent.getParcelableExtra(
          MediaPlayerModule.ResultReceiver_IS_PLAYING
        );
      } catch (NullPointerException e) {
        stopSelf();
        Log.e(TAG, "isPlaying null pointer exception: " + e);
        return;
      }

      Bundle bundle = new Bundle();

      if (mediaPlayer == null) {
        bundle.putBoolean("isPlaying", false);
      } else {
        bundle.putBoolean("isPlaying", mediaPlayer.isPlaying());
      }

      resultReceiver.send(0, bundle);
    }
  };

  private void registerIsPlayingReceiver() {
    IntentFilter filter = new IntentFilter(MediaPlayerModule.Broadcast_IS_PLAYING);
    registerReceiver(isPlayingReceiver, filter);
  }

  private BroadcastReceiver seekToReceiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      float progress;

      try {
        progress = intent.getExtras().getFloat("progress");
      } catch (NullPointerException e) {
        stopSelf();
        Log.e(TAG, "progress null pointer exception: " + e);
        return;
      }
      
      if (progress < 0 || progress > 1) {
        return;
      }

      if (mediaPlayer == null) {
        Log.e(TAG, "seekTo called when the player is still null");
        return;
      } else if (!mediaPlayerPrepared) {
        Log.e(TAG, "seekTo called during the player is still preparing");
        return;
      }

      int duration = mediaPlayer.getDuration();
      int pos = (int)((float)duration * progress);
      mediaPlayer.seekTo(pos);
    }
  };

  private void registerSeekToReceiver() {
    IntentFilter filter = new IntentFilter(MediaPlayerModule.Broadcast_SEEK_TO);
    registerReceiver(seekToReceiver, filter);
  }
  

  private BroadcastReceiver getDuration = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      ResultReceiver resultReceiver;
      try {
        resultReceiver = intent.getParcelableExtra(
          MediaPlayerModule.ResultReceiver_GET_DURATION
        );
      } catch (NullPointerException e) {
        stopSelf();
        Log.e(TAG, "getDuration null pointer exception: " + e);
        return;
      }

      if (mediaPlayer == null) {
        Log.e(TAG, "getDuration called when the player is still null");
        resultReceiver.send(1, bundlWithError("player is still null"));
        return;
      } else if (!mediaPlayerPrepared) {
        Log.e(TAG, "getDuration called during the player is still preparing");
        resultReceiver.send(1, bundlWithError("player is still preparing"));
        return;
      }

      Bundle bundle = new Bundle();
      int duration = 0;

      if (mediaPlayer != null && mediaPlayerPrepared) {
        duration = mediaPlayer.getDuration();
        if (duration == -1) {
          duration = 0;
        } else {
          duration = duration / 1000;
        }
      }

      bundle.putInt("duration", duration);
      resultReceiver.send(0, bundle);
    }
  };

  private void registerGetDurationReceiver() {
    IntentFilter filter = new IntentFilter(MediaPlayerModule.Broadcast_GET_DURATION);
    registerReceiver(getDuration, filter);
  }

  private Bundle bundlWithError(String error) {
    Bundle bundle = new Bundle();
    bundle.putString("error", error);
    return bundle;
  }

  // Media Player events implementaions

  @Override
  public void onBufferingUpdate(MediaPlayer mp, int percent) {
    // Invoked indicating buffering status of
    // a media resource being streamed over the network.
  }

  @Override
  public void onCompletion(MediaPlayer mp) {
    // Invoked when playback of a media source has completed.
    stopMedia();

    if (!playbackError) {
      // Notify the bridge module that the playback has finished. Only do this
      // when no errors have happened. The stop result receiver will be
      // executed on error. Having "track ended" and "stop" at the same time
      // would be confusing.
      endTrackResultReceiver.send(0, null);
    }

    // Stop the service
    stopSelf();
  }

  // Handle medila player errors.
  @Override
  public boolean onError(MediaPlayer mp, int what, int extra) {
    // Invoked when there has been an error during an asynchronous operation.
    playbackError = true;

    String msg;
    switch (what) {
      case MediaPlayer.MEDIA_ERROR_NOT_VALID_FOR_PROGRESSIVE_PLAYBACK:
        msg = "MediaPlayer Error not valid for progressive playback " + extra;
        break;
      case MediaPlayer.MEDIA_ERROR_SERVER_DIED:
        msg = "MediaPlayer Error server died " + extra;
        break;
      case MediaPlayer.MEDIA_ERROR_UNKNOWN:
        msg = "MediaPlayer Error unknown " + extra;
        break;
      default:
        msg = "MediaPlayer Error really uknown type this time (" + what + ") " + extra;
    }

    Toast.makeText(this, msg, Toast.LENGTH_LONG).show();
    Log.e(TAG, msg);

    if (mediaPlayer != null) {
      mediaPlayer.reset();
      mediaPlayer.release();
      mediaPlayer = null;
      mediaPlayerPrepared = false;
      removeAudioFocus();
      stopResultReceiver.send(0, null);
    }

    return false;
  }

  @Override
  public boolean onInfo(MediaPlayer mp, int what, int extra) {
    // Invoked to communicate some info.
    return false;
  }

  @Override
  public void onPrepared(MediaPlayer mp) {
    // Invoked when the media source is ready for playback.
    logDebug("mediaPlayer prepared!");
    mediaPlayerPrepared = true;

    if (setTrackResultReceiver == null) {
      playMedia();
      return;
    }

    setTrackResultReceiver.send(0, null);
    setTrackResultReceiver = null;
  }

  @Override
  public void onSeekComplete(MediaPlayer mp) {
    // Invoked indicating the completion of a seek operation.
  }

  // AudioManager methods

  @Override
  public void onAudioFocusChange(int focusState) {
    // Invoked when the audio focus of the system is updated.
    switch (focusState) {
      case AudioManager.AUDIOFOCUS_GAIN:
        // resume playback
        if (mediaPlayer == null) {
          initMediaPlayer();
        }
        else if (!mediaPlayer.isPlaying()) {
          mediaPlayer.start();
          playResultReceiver.send(0, null);
        }
        mediaPlayer.setVolume(1.0f, 1.0f);
        break;
      case AudioManager.AUDIOFOCUS_LOSS:
        // Lost focus for an unbounded amount of time: stop playback and release media player
        if (mediaPlayer.isPlaying()) {
          mediaPlayer.stop();
          stopResultReceiver.send(0, null);
        }
        mediaPlayer.reset();
        mediaPlayer.release();
        mediaPlayer = null;
        break;
      case AudioManager.AUDIOFOCUS_LOSS_TRANSIENT:
        // Lost focus for a short time, but we have to stop
        // playback. We don't release the media player because playback
        // is likely to resume
        if (mediaPlayer.isPlaying()) {
          mediaPlayer.pause();
          pauseResultReceiver.send(0, null);
        }
        break;
      case AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK:
        // Lost focus for a short time, but it's ok to keep playing
        // at an attenuated level
        if (mediaPlayer.isPlaying()) {
          mediaPlayer.setVolume(0.1f, 0.1f);
        }
        break;
    }
  }
      
  private boolean requestAudioFocus() {
    if (audioManager == null) {
      audioManager = (AudioManager)getSystemService(Context.AUDIO_SERVICE);
    }

    int result = audioManager.requestAudioFocus(
      this,
      AudioManager.STREAM_MUSIC,
      AudioManager.AUDIOFOCUS_GAIN
    );

    if (result == AudioManager.AUDIOFOCUS_REQUEST_GRANTED) {
      // Focus gained
      return true;
    }

    Log.e(TAG, "could not gain audio focus");
    return false;
  }

  private boolean removeAudioFocus() {
    if (audioManager == null) {
      // The audio focus was never requested. So we can consider it removed.
      return true;
    }

    return AudioManager.AUDIOFOCUS_REQUEST_GRANTED ==
      audioManager.abandonAudioFocus(this);
  }


  // Media methods

  private void playMedia() {
    if (mediaPlayer == null) {
      initMediaPlayer();
      return;
    }
    if (!mediaPlayerPrepared) {
      Log.e(TAG, "playMedia called when the player is still preparing");
      return;
    }
    if (!mediaPlayer.isPlaying()) {
      playbackError = false;
      mediaPlayer.start();
    }
  }

  private void stopMedia() {
    if (mediaPlayer == null) return;
    if (mediaPlayer.isPlaying()) {
      mediaPlayer.stop();
    }
  }

  private void pauseMedia() {
    if (mediaPlayer == null) return;
    if (mediaPlayer.isPlaying()) {
      mediaPlayer.pause();
      resumePosition = mediaPlayer.getCurrentPosition();
    }
  }

  private void resumeMedia() {
    if (!mediaPlayerPrepared) {
      Log.e(TAG, "resumeMedia called when the player is still not prepared");
      return;
    }
    if (!mediaPlayer.isPlaying()) {
      mediaPlayer.seekTo(resumePosition);
      mediaPlayer.start();
    }
  }

  // Init methods

  private void initMediaPlayer() {
    logDebug("initializing new media player");

    mediaPlayer = new MediaPlayer();
    // Set up MediaPlayer event listeners
    mediaPlayer.setOnCompletionListener(this);
    mediaPlayer.setOnErrorListener(this);
    mediaPlayer.setOnPreparedListener(this);
    mediaPlayer.setOnBufferingUpdateListener(this);
    mediaPlayer.setOnSeekCompleteListener(this);
    mediaPlayer.setOnInfoListener(this);
    // Reset so that the MediaPlayer is not pointing to another data source
    mediaPlayer.reset();
    mediaPlayer.setAudioAttributes(new AudioAttributes.Builder()
             .setUsage(AudioAttributes.USAGE_MEDIA)
             .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
             .build());
    mediaPlayer.setLooping(MediaPlayerModule.repeatSong);

    Uri uri = Uri.parse(mediaFile);
    logDebug("setting media source to " + uri);

    try {
        // Set the data source to the mediaFile location
        mediaPlayer.setDataSource(this, uri, MediaPlayerModule.AuthHeaders);
    } catch (IOException e) {
        Log.e(TAG, "set data source exception: " + e);
        e.printStackTrace();
        stopSelf();
        mediaPlayer.reset();
        mediaPlayer.release();
        mediaPlayer = null;
        return;
    }

    logDebug("preparing mediaPlayer");
    mediaPlayerPrepared = false;
    mediaPlayer.prepareAsync();
  }

  private void logDebug(String msg) {
    if (!debugMode) {
      return;
    }

    Log.d(TAG, msg);
  }
}
