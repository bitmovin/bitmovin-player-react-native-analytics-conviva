package com.bitmovin.player.reactnative.analytics.conviva

import com.bitmovin.player.reactnative.analytics.conviva.converter.toSsaiAdInfo
import com.bitmovin.player.reactnative.extensions.toMap
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule.NAME)
class BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule(context: ReactApplicationContext) :
    BitmovinBaseModule(context) {
    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    fun isAdBreakActive(nativeId: NativeId, promise: Promise) {
        promise.unit.resolveOnUiThreadWithConvivaAnalytics(nativeId) {
            promise.resolve(ssai.isAdBreakActive)
        }
    }

    @ReactMethod
    fun reportAdBreakStarted(nativeId: NativeId, adBreakInfo: ReadableMap, promise: Promise) {
        promise.unit.resolveOnUiThreadWithConvivaAnalytics(nativeId) {
            ssai.reportAdBreakStarted(adBreakInfo.toMap())
            promise.resolve(null)
        }
    }

    @ReactMethod
    fun reportAdBreakFinished(nativeId: NativeId, promise: Promise) {
        promise.unit.resolveOnUiThreadWithConvivaAnalytics(nativeId) {
            ssai.reportAdBreakFinished()
            promise.resolve(null)
        }
    }

    @ReactMethod
    fun reportAdStarted(nativeId: NativeId, adInfo: ReadableMap, promise: Promise) {
        promise.unit.resolveOnUiThreadWithConvivaAnalytics(nativeId) {
            ssai.reportAdStarted(adInfo.toSsaiAdInfo())
            promise.resolve(null)
        }
    }

    @ReactMethod
    fun reportAdFinished(nativeId: NativeId, promise: Promise) {
        promise.unit.resolveOnUiThreadWithConvivaAnalytics(nativeId) {
            ssai.reportAdFinished()
            promise.resolve(null)
        }
    }

    @ReactMethod
    fun reportAdSkipped(nativeId: NativeId, promise: Promise) {
        promise.unit.resolveOnUiThreadWithConvivaAnalytics(nativeId) {
            ssai.reportAdSkipped()
            promise.resolve(null)
        }
    }

    @ReactMethod
    fun updateAdInfo(nativeId: NativeId, adInfo: ReadableMap, promise: Promise) {
        promise.unit.resolveOnUiThreadWithConvivaAnalytics(nativeId) {
            ssai.updateAdInfo(adInfo.toSsaiAdInfo())
            promise.resolve(null)
        }
    }

    companion object {
        const val NAME = "BitmovinPlayerReactNativeAnalyticsConvivaSsai"
    }
}
