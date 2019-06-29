package com.httpms;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.os.Bundle;
import android.os.ResultReceiver;
import android.support.annotation.Nullable;
import android.widget.Toast;

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

public class MediaPlayerModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

  ReactApplicationContext context;
  Map<String, Object> constants;

  private final String authHeaderName = "Authorization";
  private MediaPlayerService player;
  boolean serviceBound = false;
  boolean serviceStarting = false;

  public static final String Broadcast_PLAY_NEW_AUDIO = "com.httpms.PlayNewAudio";
  public static final String Broadcast_PLAY = "com.httpms.Play";
  public static final String Broadcast_PAUSE = "com.httpms.Pause";
  public static final String Broadcast_GET_CURRENT_TIME = "com.httpms.GetCurrentTime";

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
      Toast.makeText(context, "Service Bound", Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onServiceDisconnected(ComponentName name) {
      serviceStarting = false;
      serviceBound = false;
    }
  };

  @ReactMethod
  private void play() {
    if (serviceStarting) {
      return;
    }

    if (playlist.length <= 0) {
      sendErrorEvent("Playlist empty, nothing to play.");
      return;
    }

    if (currentIndex < 0 || currentIndex >= playlist.length) {
      sendErrorEvent(String.format(
        "current index %d out of playlist size %d",
        currentIndex,
        playlist.length
      ));
      return;
    }

    final String media = playlist[currentIndex];
    final PlayReceiver playReceiver = new PlayReceiver();

    //Check is service is active
    if (!serviceBound) {
      Intent playerIntent = new Intent(context, MediaPlayerService.class);
      playerIntent.putExtra("media", media);
      playerIntent.putExtra(ResultReceiver_PLAY, playReceiver);
      context.startService(playerIntent);
      context.bindService(playerIntent, serviceConnection, Context.BIND_AUTO_CREATE);
      serviceStarting = true;
    } else {
      Intent broadcastIntent = new Intent(Broadcast_PLAY);
      broadcastIntent.putExtra("media", media);
      broadcastIntent.putExtra(ResultReceiver_PLAY, playReceiver);
      context.sendBroadcast(broadcastIntent);
    }
  }

  @ReactMethod
  private void pause() {
    Intent intent = new Intent(Broadcast_PAUSE);
    intent.putExtra(ResultReceiver_PAUSE, new PauseReceiver());
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
    callback.invoke(900);
  }

  @ReactMethod
  public void setShuffle(final boolean isSet) {
    shuffle = isSet;
  }

  @ReactMethod
  public void setRepeat(final boolean setRepeat, final boolean setRepeatSong) {
    repeat = setRepeat;
    repeatSong = setRepeatSong;
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

    currentIndex = index;

    sendTrackSetEvent(index);
    sendMediaLoadedEvent();

    if (onSuccess != null) {
      onSuccess.invoke();
    }
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
    Toast.makeText(context, "Host Resume", Toast.LENGTH_SHORT).show();
  }

  @Override
  public void onHostPause() {
    Toast.makeText(context, "Host Pause", Toast.LENGTH_SHORT).show();
  }

  @Override
  public void onHostDestroy() {
      if (!serviceBound) {
        return;
      }

      context.unbindService(serviceConnection);
      player.stopSelf();
  }

  public static final String ResultReceiver_CURRENT_TIME = "com.httpms.resultReceiver.currentTime";
  private final class CurrentTimeReceiver extends ResultReceiver {

    Callback callback;

    public CurrentTimeReceiver(Callback withCallback) {
      super(null);
      callback = withCallback;
    }

    @Override
    protected void onReceiveResult(int resultCode, Bundle bundle) {
      int time = bundle.getInt("time");
      boolean isPlaying = bundle.getBoolean("isPlaying");

      callback.invoke(time, isPlaying);
    }
  }

  public static final String ResultReceiver_PLAY = "com.httpms.resultReceiver.play";
  private final class PlayReceiver extends ResultReceiver {
    public PlayReceiver() {
      super(null);
    }

    @Override
    protected void onReceiveResult(int resultCode, Bundle bundle) {
      if (resultCode != 0) {
        return;
      }
      sendPlayStartedEvent();
    }
  }

  public static final String ResultReceiver_PAUSE = "com.httpms.resultReceiver.pause";
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
}
