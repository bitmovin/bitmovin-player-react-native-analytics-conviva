package com.bitmovin.player.reactnative.analytics.conviva

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class BitmovinPlayerReactNativeAnalyticsConvivaModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  fun message(prefix: String, promise: Promise) {
    promise.resolve("$prefix on Android!")
  }

  companion object {
    const val NAME = "BitmovinPlayerReactNativeAnalyticsConviva"
  }
}
