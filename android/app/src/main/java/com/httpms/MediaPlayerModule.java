package com.httpms;

import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

public class MediaPlayerModule extends ReactContextBaseJavaModule {

  ReactApplicationContext context;
  Map<String, Object> constants;
  boolean serviceStarted;

  public MediaPlayerModule(ReactApplicationContext context) {
    super(context);
    this.context = context;
    this.serviceStarted = false;

    this.constants = new HashMap<>();
    this.constants.put("IsAndroid", true);
  }

  @Override
  public String getName() {
    return "MediaPlayer";
  }

  @ReactMethod
  public void startService() {
    if (serviceStarted) {
      return;
    }

    Intent intent = new Intent(context, MediaPlayerService.class);
    context.startService(intent);
    serviceStarted = true;
  }

  @Override
  public Map<String, Object> getConstants() {
    return constants;
  }
}
