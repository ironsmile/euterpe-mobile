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
import android.os.Handler;
import android.os.Message;
import android.os.HandlerThread;
import android.os.Process;
import android.os.Looper;
import android.os.IBinder;
import android.os.Binder;
import android.widget.Toast;
import android.net.Uri;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

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
    registerPlayNewAudio();
    registerBecomingNoisyReceiver();
	}


	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		Toast.makeText(this, "service starting", Toast.LENGTH_SHORT).show();

		// For each start request, send a message to start a job and deliver the
		// start ID so we know which request we're stopping when we finish the job
		Message msg = servicePlayer.obtainMessage();
		msg.arg1 = startId;
		servicePlayer.sendMessage(msg);

    String authToken = "";

    try {
      //An audio file is passed to the service through putExtra();
      mediaFile = intent.getExtras().getString("media");
      authToken = intent.getExtras().getString("token");
    } catch (NullPointerException e) {
      stopSelf();
      return START_STICKY;
    }

    //Request audio focus
    if (requestAudioFocus() == false) {
      //Could not gain focus
      stopSelf();
      return START_STICKY;
    }

    if (mediaFile != null && mediaFile != "") {
      initMediaPlayer();
    }

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
    unregisterReceiver(playNewAudio);
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
  private BroadcastReceiver playNewAudio = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      try {
        //An audio file is passed to the service through putExtra();
        mediaFile = intent.getExtras().getString("media");
      } catch (NullPointerException e) {
        stopSelf();
        return;
      }

      //A PLAY_NEW_AUDIO action received
      //reset mediaPlayer to play the new Audio
      stopMedia();
      mediaPlayer.reset();
      initMediaPlayer();
    }
  };

  private void registerPlayNewAudio() {
    //Register playNewMedia receiver
    IntentFilter filter = new IntentFilter(MediaPlayerModule.Broadcast_PLAY_NEW_AUDIO);
    registerReceiver(playNewAudio, filter);
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
    playMedia();
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
        if (mediaPlayer == null) initMediaPlayer();
        else if (!mediaPlayer.isPlaying()) mediaPlayer.start();
        mediaPlayer.setVolume(1.0f, 1.0f);
        break;
      case AudioManager.AUDIOFOCUS_LOSS:
        // Lost focus for an unbounded amount of time: stop playback and release media player
        if (mediaPlayer.isPlaying()) mediaPlayer.stop();
        mediaPlayer.release();
        mediaPlayer = null;
        break;
      case AudioManager.AUDIOFOCUS_LOSS_TRANSIENT:
        // Lost focus for a short time, but we have to stop
        // playback. We don't release the media player because playback
        // is likely to resume
        if (mediaPlayer.isPlaying()) mediaPlayer.pause();
        break;
      case AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK:
        // Lost focus for a short time, but it's ok to keep playing
        // at an attenuated level
        if (mediaPlayer.isPlaying()) mediaPlayer.setVolume(0.1f, 0.1f);
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
