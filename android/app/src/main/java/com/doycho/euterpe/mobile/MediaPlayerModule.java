package com.doycho.euterpe.mobile;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.os.Bundle;
import android.os.ResultReceiver;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

/*
  !TODO: some variables here are not protected by a lock and may be used from different
  threads. Notable examples are the playlist and currentIndex.
*/
public class MediaPlayerModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

  ReactApplicationContext context;
  Map<String, Object> constants;

  private static final String TAG = "MediaPlayerModule";
  private final String authHeaderName = "Authorization";
  private MediaPlayerService player;
  boolean serviceBound = false;
  boolean serviceStarting = false;
  boolean isDebugMode = false;

  public static final String Broadcast_PLAY = "com.doycho.euterpe.mobile.Play";
  public static final String Broadcast_SET_TRACK = "com.doycho.euterpe.mobile.SetTrack";
  public static final String Broadcast_PAUSE = "com.doycho.euterpe.mobile.Pause";
  public static final String Broadcast_STOP = "com.doycho.euterpe.mobile.Stop";
  public static final String Broadcast_GET_CURRENT_TIME = "com.doycho.euterpe.mobile.GetCurrentTime";
  public static final String Broadcast_GET_DURATION = "com.doycho.euterpe.mobile.GetDuration";
  public static final String Broadcast_SEEK_TO = "com.doycho.euterpe.mobile.SeekTo";
  public static final String Broadcast_IS_PLAYING = "com.doycho.euterpe.mobile.IsPlaying";

  public static Map<String, String> AuthHeaders;
  public static boolean repeat;
  public static boolean repeatSong;
  public static boolean shuffle;
  public static String[] playlist;
  public static int currentIndex;

  public MediaPlayerModule(ReactApplicationContext context) {
    super(context);
    this.context = context;

    this.currentIndex = 0;
    this.constants = new HashMap<>();
    this.AuthHeaders = new HashMap<>();
    this.constants.put("IsAndroid", true);
    this.context.addLifecycleEventListener(this);
  }

  @Override
  public String getName() {
    return "MediaPlayer";
  }

  //Binding this Client to the AudioPlayer Service
  private ServiceConnection serviceConnection = new ServiceConnection() {
    @Override
    public void onServiceConnected(ComponentName name, IBinder service) {
      // We've bound to LocalService, cast the IBinder and get LocalService instance
      MediaPlayerService.LocalBinder binder = (MediaPlayerService.LocalBinder) service;
      player = binder.getService();
      serviceBound = true;
      serviceStarting = false;
      logDebug("Service Bound");
    }

    @Override
    public void onServiceDisconnected(ComponentName name) {
      logDebug("Service Unbound");
      serviceStarting = false;
      serviceBound = false;
    }
  };

  @ReactMethod
  private void startMusicService(final boolean debugMode) {
    isDebugMode = debugMode;

    if (serviceBound || serviceStarting) {
      logDebug(String.format(
        "Music Service already bound or starting. sb: %b, ss: %b",
        serviceBound,
        serviceStarting
      ));
      return;
    }

    logDebug("Starting Music Service");

    Intent playerIntent = new Intent(context, MediaPlayerService.class);
    playerIntent.putExtra(ResultReceiver_END_TRACK, new EndTrackReceiver());
    playerIntent.putExtra(ResultReceiver_PLAY, new PlayReceiver());
    playerIntent.putExtra(ResultReceiver_PAUSE, new PauseReceiver());
    playerIntent.putExtra(ResultReceiver_STOP, new StopReceiver());
    playerIntent.putExtra(ResultReceiver_SEEK_COMPLETED, new SeekCompletedReceiver());
    playerIntent.putExtra("debugMode", debugMode);
    serviceStarting = true;
    context.startService(playerIntent);
    context.bindService(playerIntent, serviceConnection, Context.BIND_AUTO_CREATE);
  }

  @ReactMethod
  private void isPlaying(final Callback callback) {
    if (!serviceBound || serviceStarting) {
      callback.invoke(false, currentIndex);
      return;
    }

    Intent intent = new Intent(Broadcast_IS_PLAYING);
    intent.putExtra(ResultReceiver_IS_PLAYING, new IsPlayingReceiver(callback));
    context.sendBroadcast(intent);
  }

  @ReactMethod
  private void play() {
    if (serviceStarting) {
      sendErrorEvent("Аndroid playback service is still starting.");
      return;
    }

    if (!serviceBound) {
      sendErrorEvent("Аndroid playback service is not bound.");
      return;
    }

    if (playlist.length <= 0) {
      sendErrorEvent("Playlist empty, nothing to play.");
      return;
    }

    final PlayReceiver playReceiver = new PlayReceiver();
    Intent intent = new Intent(Broadcast_PLAY);
    intent.putExtra(ResultReceiver_PLAY, playReceiver);
    context.sendBroadcast(intent);
  }

  @ReactMethod
  private void pause() {
    Intent intent = new Intent(Broadcast_PAUSE);
    intent.putExtra(ResultReceiver_PAUSE, new PauseReceiver());
    context.sendBroadcast(intent);
  }

  @ReactMethod
  private void stop() {
    Intent intent = new Intent(Broadcast_STOP);
    intent.putExtra(ResultReceiver_STOP, new StopReceiver());
    context.sendBroadcast(intent);
  }

  @ReactMethod
  public void getCurrentTime(final Callback callback) {
    Intent intent = new Intent(Broadcast_GET_CURRENT_TIME);
    intent.putExtra(ResultReceiver_CURRENT_TIME, new CurrentTimeReceiver(callback));
    context.sendBroadcast(intent);
  }

  @ReactMethod
  public void getDuration(final Callback callback) {
    Intent intent = new Intent(Broadcast_GET_DURATION);
    intent.putExtra(ResultReceiver_GET_DURATION, new GetDurationReceiver(callback));
    context.sendBroadcast(intent);
  }

  @ReactMethod
  public void restorePlayerState(
    final boolean setShuffle,
    final boolean setRepeat,
    final boolean setRepeatSong
  ) {
    shuffle = setShuffle;
    repeat = setRepeat;
    repeatSong = setRepeatSong;
  }

  @ReactMethod
  public void setShuffle(final boolean isSet) {
    shuffle = isSet;

    String msg;
    if (isSet) {
      msg = "Shuffle On";
    } else {
      msg = "Shuffle Off";
    }

    Toast.makeText(context, msg, Toast.LENGTH_SHORT).show();
  }

  @ReactMethod
  public void setRepeat(final boolean setRepeat, final boolean setRepeatSong) {
    repeat = setRepeat;
    repeatSong = setRepeatSong;

    String msg;
    if (setRepeat && !setRepeatSong) {
      msg = "Repeat Queue";
    } else if (setRepeat && setRepeatSong) {
      msg = "Repeat Song";
    } else {
      msg = "Repeat Off";
    }

    Toast.makeText(context, msg, Toast.LENGTH_SHORT).show();
  }

  @ReactMethod
  public void setPlaylist(ReadableArray newPlaylist, final Callback callback) {
    final int newPlaylistSize = newPlaylist.size();
    String[] tmpPlaylist = new String[newPlaylistSize];

    for (int i = 0; i < newPlaylistSize; i++) {
      tmpPlaylist[i] = newPlaylist.getString(i);
    }

    playlist = tmpPlaylist;

    callback.invoke(currentIndex);
  }

  @ReactMethod
  public void appendPlaylist(ReadableArray songs, final Callback callback) {
    final int currentPlaylistSize = playlist.length;
    final int songsSize = songs.size();
    final int newPlaylistSize = songsSize + currentPlaylistSize;
    String[] tmpPlaylist = new String[newPlaylistSize];

    for (int i = 0; i < currentPlaylistSize; i++) {
      tmpPlaylist[i] = playlist[i];
    }

    for (int i = 0; i < songsSize; i++) {
      tmpPlaylist[currentPlaylistSize + i] = songs.getString(i);
    }

    playlist = tmpPlaylist;

    callback.invoke();
  }

  @ReactMethod
  public void seekTo(float progress) {
    if (progress < 0 || progress > 1) {
      return;
    }

    Intent intent = new Intent(Broadcast_SEEK_TO);
    intent.putExtra("progress", progress);
    context.sendBroadcast(intent);
  }

  @ReactMethod
  public void setCurrent(int index) {
    currentIndex = index;
  }

  @ReactMethod
  public void setTrack(int index, final Callback onSuccess) {
    final int playlistLen = playlist.length;

    if (index < 0 || index >= playlistLen) {
      sendErrorEvent(String.format(
        "current index %d out of playlist size %d",
        currentIndex,
        playlistLen
      ));
      return;
    }

    sendMediaLoadingEvent();

    final SetTrackReceiver resultReceiver = new SetTrackReceiver(onSuccess, index);
    broadcastSetTrack(index, resultReceiver);
  }

  private void broadcastSetTrack(int index, SetTrackReceiver resultReceiver) {
    final String media = playlist[index];
    Intent intent = new Intent(Broadcast_SET_TRACK);
    intent.putExtra("media", media);
    intent.putExtra(ResultReceiver_SET_TRACK, resultReceiver);
    context.sendBroadcast(intent);
  }

  @ReactMethod
  public void next() {
    final int playlistLen = playlist.length;
    int nextIndex = currentIndex + 1;

    if (nextIndex >= playlistLen) {
      if (!MediaPlayerModule.repeat) {
        return;
      }
      nextIndex = 0;
    }

    sendPlayCompletedEvent(true);
    sendMediaLoadingEvent();
    final SetTrackReceiver resultReceiver = new SetTrackReceiver(nextIndex);
    broadcastSetTrack(nextIndex, resultReceiver);
  }

  @ReactMethod
  public void previous() {
    final int prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      return;
    }

    sendPlayCompletedEvent(true);
    sendMediaLoadingEvent();
    final SetTrackReceiver resultReceiver = new SetTrackReceiver(prevIndex);
    broadcastSetTrack(prevIndex, resultReceiver);
  }

  @ReactMethod
  public void setAuthenticationHeader(ReadableMap headers) {
    if (headers.hasKey(authHeaderName)) {
      AuthHeaders.put(authHeaderName, headers.getString(authHeaderName));
    }
  }

  @Override
  public Map<String, Object> getConstants() {
    return constants;
  }


  // @Override
  // public void onHostSaveInstanceState(Bundle savedInstanceState) {
  //   savedInstanceState.putBoolean("ServiceBound", serviceBound);
  // }

  // @Override
  // public void onHostRestoreInstanceState(Bundle savedInstanceState) {
  //   serviceBound = savedInstanceState.getBoolean("ServiceBound");
  // }

  @Override
  public void onHostResume() {
    if (!isDebugMode) {
      return;
    }

    int playlistLen = -1;
    if (playlist != null) {
      playlistLen = playlist.length;
    }

    logDebug(String.format(
      "Host Resume. sb: %b, ss: %b, pl: %d",
      serviceBound,
      serviceStarting,
      playlistLen
    ));
  }

  @Override
  public void onHostPause() {
    logDebug("Host Pause");
  }

  @Override
  public void onHostDestroy() {
    logDebug(String.format(
      "Host Destroy. ss: %b, sb: %b",
      serviceStarting,
      serviceBound
    ));

    if (serviceStarting) {
      player.stopSelf();
      return;
    }

    if (!serviceBound) {
      return;
    }

    context.unbindService(serviceConnection);
    serviceBound = false;
    player.stopSelf();
  }

  public static final String ResultReceiver_CURRENT_TIME = "com.doycho.euterpe.mobile.resultReceiver.currentTime";
  private final class CurrentTimeReceiver extends ResultReceiver {

    Callback callback;

    public CurrentTimeReceiver(Callback withCallback) {
      super(null);
      callback = withCallback;
    }

    @Override
    protected void onReceiveResult(int resultCode, Bundle bundle) {
      if (resultCode != 0) {
        sendErrorEvent(bundle.getString("error"));
        return;
      }

      int time = bundle.getInt("time");
      boolean isPlaying = bundle.getBoolean("isPlaying");

      callback.invoke(time, isPlaying);
    }
  }

  public static final String ResultReceiver_GET_DURATION = "com.doycho.euterpe.mobile.resultReceiver.getDuration";
  private final class GetDurationReceiver extends ResultReceiver {

    Callback callback;

    public GetDurationReceiver(Callback withCallback) {
      super(null);
      callback = withCallback;
    }

    @Override
    protected void onReceiveResult(int resultCode, Bundle bundle) {
      if (resultCode != 0) {
        sendErrorEvent(bundle.getString("error"));
        return;
      }

      callback.invoke(bundle.getInt("duration"));
    }
  }

  public static final String ResultReceiver_SET_TRACK = "com.doycho.euterpe.mobile.resultReceiver.setTrack";
  private final class SetTrackReceiver extends ResultReceiver {

    private Callback callback;
    private int index;
    private boolean playAfterSet = false;

    public SetTrackReceiver(Callback withCallback, int newIndex) {
      super(null);
      callback = withCallback;
      index = newIndex;
      playAfterSet = false;
    }

    public SetTrackReceiver(int newIndex) {
      super(null);
      index = newIndex;
      playAfterSet = true;
    }

    @Override
    protected void onReceiveResult(int resultCode, Bundle bundle) {
      currentIndex = index;
      sendTrackSetEvent(index);
      sendMediaLoadedEvent();

      if (callback != null) {
        callback.invoke();
      }

      if (playAfterSet) {
        play();
      }
    }
  }

  public static final String ResultReceiver_END_TRACK = "com.doycho.euterpe.mobile.resultReceiver.endTrack";
  private final class EndTrackReceiver extends ResultReceiver {

    public EndTrackReceiver() {
      super(null);
    }

    @Override
    protected void onReceiveResult(int resultCode, Bundle bundle) {
      boolean success = resultCode == 0;
      sendPlayCompletedEvent(success);

      if (repeatSong) {
        play();
        return;
      }

      final int playlistLen = playlist.length;
      if (shuffle && playlistLen > 1) {
        int randomIndex = currentIndex;
        Random rand = new Random();
        while (randomIndex == currentIndex) {
          randomIndex = rand.nextInt(playlistLen);
        }

        sendMediaLoadingEvent();
        final SetTrackReceiver resultReceiver = new SetTrackReceiver(randomIndex);
        broadcastSetTrack(randomIndex, resultReceiver);
        return;
      }

      int nextIndex = currentIndex + 1;

      if (nextIndex >= playlistLen) {
        if (repeat) {
          nextIndex = 0;
        } else {
          // Nothing else to play. Release media player and focus.
          stop();
          return;
        }
      }

      sendMediaLoadingEvent();
      final SetTrackReceiver resultReceiver = new SetTrackReceiver(nextIndex);
      broadcastSetTrack(nextIndex, resultReceiver);
    }
  }

  public static final String ResultReceiver_PLAY = "com.doycho.euterpe.mobile.resultReceiver.play";
  private final class PlayReceiver extends ResultReceiver {
    public PlayReceiver() {
      super(null);
    }

    @Override
    protected void onReceiveResult(int resultCode, Bundle bundle) {
      if (resultCode != 0) {
        sendErrorEvent(bundle.getString("error"));
        return;
      }
      sendPlayStartedEvent();
    }
  }

  public static final String ResultReceiver_PAUSE = "com.doycho.euterpe.mobile.resultReceiver.pause";
  private final class PauseReceiver extends ResultReceiver {
    public PauseReceiver() {
      super(null);
    }

    @Override
    protected void onReceiveResult(int resultCode, Bundle bundle) {
      if (resultCode != 0) {
        return;
      }
      sendPausedEvent();
    }
  }

  public static final String ResultReceiver_STOP = "com.doycho.euterpe.mobile.resultReceiver.stop";
  private final class StopReceiver extends ResultReceiver {
    public StopReceiver() {
      super(null);
    }

    @Override
    protected void onReceiveResult(int resultCode, Bundle bundle) {
      if (resultCode != 0) {
        return;
      }
      sendStoppedEvent();
    }
  }

  public static final String ResultReceiver_SEEK_COMPLETED = "com.doycho.euterpe.mobile.resultReceiver.trackCompleted";
  private final class SeekCompletedReceiver extends ResultReceiver {
    public SeekCompletedReceiver() {
      super(null);
    }

    @Override
    protected void onReceiveResult(int resultCode, Bundle bundle) {
      if (resultCode != 0) {
        return;
      }
      sendSeekCompletedEvent(bundle.getInt("toSecond"));
    }
  }

  public static final String ResultReceiver_IS_PLAYING = "com.doycho.euterpe.mobile.resultReceiver.isPlaying";
  private final class IsPlayingReceiver extends ResultReceiver {
    Callback callback;

    public IsPlayingReceiver(Callback withCallback) {
      super(null);
      callback = withCallback;
    }

    @Override
    protected void onReceiveResult(int resultCode, Bundle bundle) {
      if (resultCode != 0) {
        sendErrorEvent(
          String.format("Error in isPlaying: %s", bundle.getString("error"))
        );
        return;
      }
      callback.invoke(bundle.getBoolean("isPlaying"), currentIndex);
    }
  }

  // Java to JS events handling.

  private void sendEvent(String eventName, @Nullable WritableMap params) {
    context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

  private final String EVENT_ERROR = "EVENT_ERROR";
  private final String EVENT_MEDIA_LOADING = "EVENT_MEDIA_LOADING";
  private final String EVENT_MEDIA_LOADED = "EVENT_MEDIA_LOADED";
  private final String EVENT_PLAY_STARTED = "EVENT_PLAY_STARTED";
  private final String EVENT_PLAY_COMPLETED = "EVENT_PLAY_COMPLETED";
  private final String EVENT_PAUSED = "EVENT_PAUSED";
  private final String EVENT_STOPPED = "EVENT_STOPPED";
  private final String EVENT_TRACK_SET = "EVENT_TRACK_SET";
  private final String EVENT_SEEK_COMPLETED = "EVENT_SEEK_COMPLETED";


  private void sendErrorEvent(final String err) {
    WritableMap params = Arguments.createMap();
    params.putString("error", err);
    sendEvent(EVENT_ERROR, params);
  }

  private void sendMediaLoadedEvent() {
    sendEvent(EVENT_MEDIA_LOADED, null);
  }

  private void sendMediaLoadingEvent() {
    sendEvent(EVENT_MEDIA_LOADING, null);
  }

  private void sendPlayStartedEvent() {
    sendEvent(EVENT_PLAY_STARTED, null);
  }

  private void sendPlayCompletedEvent(final boolean success) {
    WritableMap params = Arguments.createMap();
    params.putBoolean("success", success);
    sendEvent(EVENT_PLAY_COMPLETED, params);
  }

  private void sendPausedEvent() {
    sendEvent(EVENT_PAUSED, null);
  }

  private void sendStoppedEvent() {
    sendEvent(EVENT_STOPPED, null);
  }

  private void sendTrackSetEvent(final int index) {
    WritableMap params = Arguments.createMap();
    params.putInt("index", index);
    sendEvent(EVENT_TRACK_SET, params);
  }

  private void sendSeekCompletedEvent(final int toSecond) {
    WritableMap params = Arguments.createMap();
    params.putInt("toSecond", toSecond);
    sendEvent(EVENT_SEEK_COMPLETED, params);
  }

  private void logDebug(String msg) {
    if (!isDebugMode) {
      return;
    }

    Log.d(TAG, msg);
    Toast.makeText(context, msg, Toast.LENGTH_SHORT).show();
  }
}
