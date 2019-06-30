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
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.os.HandlerThread;
import android.os.Process;
import android.os.ResultReceiver;
import android.os.Looper;
import android.os.IBinder;
import android.os.Binder;
import android.widget.Toast;
import android.net.Uri;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.facebook.react.bridge.Callback;

public class MediaPlayerService extends Service implements MediaPlayer.OnCompletionListener,
      MediaPlayer.OnPreparedListener, MediaPlayer.OnErrorListener,
      MediaPlayer.OnSeekCompleteListener, MediaPlayer.OnInfoListener,
      MediaPlayer.OnBufferingUpdateListener, AudioManager.OnAudioFocusChangeListener {

	private int ONGOING_NOTIFICATION_ID = 42;
	private Looper serviceLooper;
	private ServicePlayer servicePlayer;
  private final IBinder iBinder = new LocalBinder();

  private AudioManager audioManager;
  private MediaPlayer mediaPlayer;
  private String mediaFile;

  private ResultReceiver setTrackResultReceiver;

  //Used to pause/resume MediaPlayer
  private int resumePosition;

	private final class ServicePlayer extends Handler {
		public ServicePlayer(Looper looper) {
			super(looper);
		}

		@Override
		public void handleMessage(Message msg) {
			try {
				Thread.sleep(20000);
			} catch (InterruptedException e) {
				// Restore interrupt status.
				Thread.currentThread().interrupt();
			}

			stopSelf(msg.arg1);
		}
	}

	@Override
	public void onCreate() {
		HandlerThread thread = new HandlerThread("ServiceStartArguments",
				Process.THREAD_PRIORITY_BACKGROUND);
		thread.start();

		serviceLooper = thread.getLooper();
		servicePlayer = new ServicePlayer(serviceLooper);

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
    registergetCurrentTime();
    registergetGetDuration();
    registerPauseReceiver();
    registerPlayReceiver();
    registerSetNewTrackReceiver();
    registerSeekToReceiver();
	}


	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		Toast.makeText(this, "service starting", Toast.LENGTH_SHORT).show();

		// For each start request, send a message to start a job and deliver the
		// start ID so we know which request we're stopping when we finish the job
		Message msg = servicePlayer.obtainMessage();
		msg.arg1 = startId;
		servicePlayer.sendMessage(msg);

		// If we get killed, after returning from here, restart
		return START_STICKY;
	}

	@Override
	public void onDestroy() {
		Toast.makeText(this, "service done", Toast.LENGTH_SHORT).show();

    if (mediaPlayer != null) {
      stopMedia();
      mediaPlayer.release();
    }
  
    removeAudioFocus();
    unregisterReceiver(becomingNoisyReceiver);
    unregisterReceiver(playReceiver);
    unregisterReceiver(pauseReceiver);
    unregisterReceiver(getCurrentTime);
    unregisterReceiver(getDuration);
    unregisterReceiver(setNewTrackReceiver);
    unregisterReceiver(seekToReceiver);
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
        //pause audio on ACTION_AUDIO_BECOMING_NOISY
        pauseMedia();
    }
  };

  private void registerBecomingNoisyReceiver() {
    //register after getting audio focus
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
        return;
      }

      //Request audio focus
      if (requestAudioFocus() == false) {
        //Could not gain focus
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
        //An audio file is passed to the service through putExtra();
        mediaFile = intent.getExtras().getString("media");
        resultReceiver = intent.getParcelableExtra(MediaPlayerModule.ResultReceiver_SET_TRACK);
      } catch (NullPointerException e) {
        stopSelf();
        return;
      }

      if (mediaPlayer != null) {
        stopMedia();
        mediaPlayer.reset();
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
        return;
      }

      pauseMedia();
      resultReceiver.send(0, null);
    }
  };

  private void registerPauseReceiver() {
    IntentFilter filter = new IntentFilter(MediaPlayerModule.Broadcast_PAUSE);
    registerReceiver(pauseReceiver, filter);
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
        return;
      }

      Bundle bundle = new Bundle();

      if (mediaPlayer == null) {
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

  private void registergetCurrentTime() {
    IntentFilter filter = new IntentFilter(MediaPlayerModule.Broadcast_GET_CURRENT_TIME);
    registerReceiver(getCurrentTime, filter);
  }

  private BroadcastReceiver seekToReceiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      float progress;

      try {
        progress = intent.getExtras().getFloat("progress");
      } catch (NullPointerException e) {
        stopSelf();
        return;
      }
      
      if (progress < 0 || progress > 1) {
        return;
      }

      if (mediaPlayer == null) {
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
        return;
      }

      Bundle bundle = new Bundle();
      int duration = 0;

      if (mediaPlayer != null) {
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

  private void registergetGetDuration() {
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
    //Invoked indicating buffering status of
    //a media resource being streamed over the network.
  }

  @Override
  public void onCompletion(MediaPlayer mp) {
    //Invoked when playback of a media source has completed.
    stopMedia();
    //stop the service
    stopSelf();
  }

  //Handle errors
  @Override
  public boolean onError(MediaPlayer mp, int what, int extra) {
    //Invoked when there has been an error during an asynchronous operation
    switch (what) {
      case MediaPlayer.MEDIA_ERROR_NOT_VALID_FOR_PROGRESSIVE_PLAYBACK:
        Toast.makeText(
          this,
          "MediaPlayer Error not valid for progressive playback " + extra,
          Toast.LENGTH_LONG
        ).show();
        break;
      case MediaPlayer.MEDIA_ERROR_SERVER_DIED:
        Toast.makeText(
          this,
          "MediaPlayer Error media error server died " + extra,
          Toast.LENGTH_LONG
        ).show();
        break;
      case MediaPlayer.MEDIA_ERROR_UNKNOWN:
        Toast.makeText(
          this,
          "MediaPlayer Error media error unknown " + extra,
          Toast.LENGTH_LONG
        ).show();
        break;
      default:
        Toast.makeText(
          this,
          "MediaPlayer Error media really uknown type this time " + extra,
          Toast.LENGTH_LONG
        ).show();
    }
    return false;
  }

  @Override
  public boolean onInfo(MediaPlayer mp, int what, int extra) {
    //Invoked to communicate some info.
    return false;
  }

  @Override
  public void onPrepared(MediaPlayer mp) {
    //Invoked when the media source is ready for playback.
    if (setTrackResultReceiver == null) {
      playMedia();
      return;
    }

    setTrackResultReceiver.send(0, null);
    setTrackResultReceiver = null;
  }

  @Override
  public void onSeekComplete(MediaPlayer mp) {
    //Invoked indicating the completion of a seek operation.
  }

  // AudioManager methods

  @Override
  public void onAudioFocusChange(int focusState) {
    //Invoked when the audio focus of the system is updated.
    switch (focusState) {
      case AudioManager.AUDIOFOCUS_GAIN:
        // resume playback
        if (mediaPlayer == null) {
          initMediaPlayer();
        }
        else if (!mediaPlayer.isPlaying()) {
          mediaPlayer.start();
        }
        mediaPlayer.setVolume(1.0f, 1.0f);
        break;
      case AudioManager.AUDIOFOCUS_LOSS:
        // Lost focus for an unbounded amount of time: stop playback and release media player
        if (mediaPlayer.isPlaying()) {
          mediaPlayer.stop();
        }
        mediaPlayer.release();
        mediaPlayer = null;
        break;
      case AudioManager.AUDIOFOCUS_LOSS_TRANSIENT:
        // Lost focus for a short time, but we have to stop
        // playback. We don't release the media player because playback
        // is likely to resume
        if (mediaPlayer.isPlaying()) {
          mediaPlayer.pause();
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
    audioManager = (AudioManager)getSystemService(Context.AUDIO_SERVICE);
    int result = audioManager.requestAudioFocus(
      this,
      AudioManager.STREAM_MUSIC,
      AudioManager.AUDIOFOCUS_GAIN
    );

    if (result == AudioManager.AUDIOFOCUS_REQUEST_GRANTED) {
      //Focus gained
      return true;
    }

    //Could not gain focus
    return false;
  }

  private boolean removeAudioFocus() {
      return AudioManager.AUDIOFOCUS_REQUEST_GRANTED ==
        audioManager.abandonAudioFocus(this);
  }


  // Media methods

  private void playMedia() {
    if (!mediaPlayer.isPlaying()) {
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
    if (mediaPlayer.isPlaying()) {
      mediaPlayer.pause();
      resumePosition = mediaPlayer.getCurrentPosition();
    }
  }

  private void resumeMedia() {
    if (!mediaPlayer.isPlaying()) {
      mediaPlayer.seekTo(resumePosition);
      mediaPlayer.start();
    }
  }

  // Init methods

  private void initMediaPlayer() {
    mediaPlayer = new MediaPlayer();
    //Set up MediaPlayer event listeners
    mediaPlayer.setOnCompletionListener(this);
    mediaPlayer.setOnErrorListener(this);
    mediaPlayer.setOnPreparedListener(this);
    mediaPlayer.setOnBufferingUpdateListener(this);
    mediaPlayer.setOnSeekCompleteListener(this);
    mediaPlayer.setOnInfoListener(this);
    //Reset so that the MediaPlayer is not pointing to another data source
    mediaPlayer.reset();
    mediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);
    mediaPlayer.setLooping(MediaPlayerModule.repeatSong);

    Uri uri = Uri.parse(mediaFile);

    try {
        // Set the data source to the mediaFile location
        mediaPlayer.setDataSource(this, uri, MediaPlayerModule.AuthHeaders);
    } catch (IOException e) {
        e.printStackTrace();
        stopSelf();
    }
    mediaPlayer.prepareAsync();
  }

}
