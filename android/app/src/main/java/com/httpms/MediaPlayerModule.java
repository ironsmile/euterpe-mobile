package com.httpms;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.os.Bundle;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;

import java.util.HashMap;
import java.util.Map;

public class MediaPlayerModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

  ReactApplicationContext context;
  Map<String, Object> constants;

  private MediaPlayerService player;
  boolean serviceBound = false;
  boolean serviceStarting = false;

  public static final String Broadcast_PLAY_NEW_AUDIO = "com.httpms.PlayNewAudio";

  public MediaPlayerModule(ReactApplicationContext context) {
    super(context);
    this.context = context;

    this.constants = new HashMap<>();
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
  private void playMedia(String media, String token) {
    if (serviceStarting) {
      return;
    }

    //Check is service is active
    if (!serviceBound) {
      Intent playerIntent = new Intent(context, MediaPlayerService.class);
      playerIntent.putExtra("media", media);
      playerIntent.putExtra("token", token);
      context.startService(playerIntent);
      context.bindService(playerIntent, serviceConnection, Context.BIND_AUTO_CREATE);
      serviceStarting = true;
    } else {
      Intent broadcastIntent = new Intent(Broadcast_PLAY_NEW_AUDIO);
      broadcastIntent.putExtra("media", media);
      context.sendBroadcast(broadcastIntent);
    }
  }

  @ReactMethod
  public void getCurrentTime(final Callback callback) {
    boolean isPlaying = false;
    callback.invoke(5, isPlaying);
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

  }

  @Override
  public void onHostPause() {

  }

  @Override
  public void onHostDestroy() {
      if (!serviceBound) {
        return;
      }

      context.unbindService(serviceConnection);
      player.stopSelf();
  }
}
