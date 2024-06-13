package com.bitmovin.player.reactnative.analytics.conviva.extensions

import com.bitmovin.player.reactnative.extensions.getModule
import com.facebook.react.bridge.*
import com.facebook.react.uimanager.UIManagerModule

inline fun <reified T : ReactContextBaseJavaModule> ReactContext.getModule(): T? {
    return getNativeModule(T::class.java)
}
val ReactApplicationContext.uiManagerModule get() =  getModule<UIManagerModule>()
