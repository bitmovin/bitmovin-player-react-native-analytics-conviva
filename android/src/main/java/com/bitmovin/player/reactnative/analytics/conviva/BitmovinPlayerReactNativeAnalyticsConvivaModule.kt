package com.bitmovin.player.reactnative.analytics.conviva

import android.util.Log
import com.bitmovin.analytics.conviva.ConvivaAnalyticsIntegration
import com.bitmovin.analytics.conviva.ConvivaConfig
import com.bitmovin.player.reactnative.analytics.conviva.converter.toErrorSeverity
import com.bitmovin.player.reactnative.analytics.conviva.converter.toMetadataOverrides
import com.bitmovin.player.reactnative.extensions.playerModule
import com.bitmovin.player.reactnative.extensions.toMap
import com.facebook.react.bridge.*

class BitmovinPlayerReactNativeAnalyticsConvivaModule(context: ReactApplicationContext) :
  BitmovinBaseModule(context) {

    private val convivaAnalyticsInstances: Registry<ConvivaAnalyticsIntegration> = mutableMapOf()

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun initWithConfig(
    nativeId: NativeId,
    playerNativeId: NativeId,
    customerKey: String,
    gatewayUrl: String?,
    debugLoggingEnabled: Boolean,
    promise: Promise,
  ) {
    promise.unit.resolveOnUiThread {
      val player = context.playerModule?.getPlayerOrNull(playerNativeId)
      if (player === null) {
        promise.reject(NAME, "Could not retrieve Player with native Id ${playerNativeId})")
        return@resolveOnUiThread
      }

      val config = ConvivaConfig()
      config.gatewayUrl = gatewayUrl
      config.isDebugLoggingEnabled = debugLoggingEnabled
      val convivaAnalytics = ConvivaAnalyticsIntegration(
        player,
        customerKey,
        context,
        config,
      )
      convivaAnalyticsInstances[nativeId] = convivaAnalytics

      Log.d("[dev]", "ConvivaAnalyticsIntegration initialized with nativeId: $nativeId")

      promise.resolve(null)
    }
  }

  @ReactMethod
  fun destroy(nativeId: NativeId, promise: Promise) {
    promise.unit.resolveOnUiThreadWithConvivaAnalytics(nativeId) {
      release()
      convivaAnalyticsInstances.remove(nativeId)
    }
  }

  @ReactMethod
  fun release(nativeId: NativeId, promise: Promise) {
    promise.unit.resolveOnUiThreadWithConvivaAnalytics(nativeId) {
      release()
    }
  }

  @ReactMethod
  fun endSession(nativeId: NativeId, promise: Promise) {
    promise.unit.resolveOnUiThreadWithConvivaAnalytics(nativeId) {
      endSession()
    }
  }

@ReactMethod
fun updateContentMetadata(nativeId: NativeId, contentMetadata: ReadableMap, promise: Promise) {
  promise.unit.resolveOnUiThreadWithConvivaAnalytics(nativeId) {
    updateContentMetadata(contentMetadata.toMetadataOverrides())
  }
}

  @ReactMethod
  fun sendCustomApplicationEvent(nativeId: NativeId, name: String, attributes: ReadableMap, promise: Promise) {
    promise.unit.resolveOnUiThreadWithConvivaAnalytics(nativeId) {
      sendCustomApplicationEvent(name, attributes.toMap())
    }
  }

  @ReactMethod
  fun sendCustomPlaybackEvent(nativeId: NativeId, name: String, attributes: ReadableMap, promise: Promise) {
    promise.unit.resolveOnUiThreadWithConvivaAnalytics(nativeId) {
        sendCustomPlaybackEvent(name, attributes.toMap())
    }
  }

  @ReactMethod
  fun reportPlaybackDeficiency(nativeId: NativeId, message: String, severity: String, endSession: Boolean, promise: Promise) {
    promise.unit.resolveOnUiThreadWithConvivaAnalytics(nativeId) {
      reportPlaybackDeficiency(message, severity.toErrorSeverity(), endSession)
    }
  }

  @ReactMethod
  fun pauseTracking(nativeId: NativeId, isBumper: Boolean, promise: Promise) {
    promise.unit.resolveOnUiThreadWithConvivaAnalytics(nativeId) {
      pauseTracking(isBumper)
    }
  }

  @ReactMethod
  fun resumeTracking(nativeId: NativeId, promise: Promise) {
    promise.unit.resolveOnUiThreadWithConvivaAnalytics(nativeId) {
      resumeTracking()
    }
}

  private inline fun <T> TPromise<T>.resolveOnUiThreadWithConvivaAnalytics(
    nativeId: NativeId,
    crossinline block: ConvivaAnalyticsIntegration.() -> T,
  ) = resolveOnUiThread { getConvivaAnalytics(nativeId, this@BitmovinPlayerReactNativeAnalyticsConvivaModule).block() }

  private fun RejectPromiseOnExceptionBlock.getConvivaAnalytics(
    nativeId: NativeId,
    convivaModule: BitmovinPlayerReactNativeAnalyticsConvivaModule = this@BitmovinPlayerReactNativeAnalyticsConvivaModule,
  ): ConvivaAnalyticsIntegration = convivaModule.getConvivaAnalyticsOrNull(nativeId) ?: throw IllegalArgumentException("Invalid BitmovinPlayerReactNativeAnalyticsConviva $nativeId")

  private fun getConvivaAnalyticsOrNull(nativeId: NativeId): ConvivaAnalyticsIntegration? {
    return convivaAnalyticsInstances[nativeId]
  }

  companion object {
    const val NAME = "BitmovinPlayerReactNativeAnalyticsConviva"
  }
}
