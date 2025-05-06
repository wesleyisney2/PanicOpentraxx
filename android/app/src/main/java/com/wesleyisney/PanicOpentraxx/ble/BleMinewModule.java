package com.wesleyisney.PanicOpentraxx.ble;

import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;
// Import da SDK Minew aqui

public class BleMinewModule extends ReactContextBaseJavaModule {
  private final ReactApplicationContext reactContext;

  public BleMinewModule(ReactApplicationContext ctx) {
    super(ctx);
    this.reactContext = ctx;
  }

  @Override
  public String getName() {
    return "BleMinewModule";
  }

  @ReactMethod
  public void startScan() {
    // TODO: SDK Minew start scan em ForegroundService
  }

  @ReactMethod
  public void stopScan() {
    // TODO: SDK Minew stop scan
  }

  private void sendEvent(String name, WritableMap params) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(name, params);
  }
}
