package com.demo;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.henninghall.date_picker.DatePickerPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.imagepicker.ImagePickerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import cn.qiuxiang.react.amap3d.AMap3DPackage;
import cn.qiuxiang.react.geolocation.AMapGeolocationPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new BackgroundTimerPackage(),
            new VectorIconsPackage(),
            new DatePickerPackage(),
            new LinearGradientPackage(),
            new ImagePickerPackage(),
            new RNGestureHandlerPackage(),
            new AMap3DPackage(),
            new AMapGeolocationPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
