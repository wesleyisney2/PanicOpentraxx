package com.wesleyisney.PanicOpentraxx.ble;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.*;
import com.facebook.react.uimanager.ViewManager;
import java.util.*;

public class BleMinewPackage implements ReactPackage {
  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext ctx) {
    return Arrays.<NativeModule>asList(new BleMinewModule(ctx));
  }
  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext ctx) {
    return Collections.emptyList();
  }
}
