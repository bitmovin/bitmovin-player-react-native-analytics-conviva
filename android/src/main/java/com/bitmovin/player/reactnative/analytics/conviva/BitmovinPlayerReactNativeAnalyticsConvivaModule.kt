package com.bitmovin.player.reactnative.analytics.conviva

import com.bitmovin.analytics.conviva.ConvivaAnalyticsIntegration
import com.bitmovin.analytics.conviva.ConvivaConfig
import com.bitmovin.player.reactnative.SharedPlayer
import com.bitmovin.player.reactnative.analytics.conviva.converter.toErrorSeverity
import com.bitmovin.player.reactnative.analytics.conviva.converter.toMetadataOverrides
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class BitmovinPlayerReactNativeAnalyticsConvivaModule : Module() {

    override fun definition() = ModuleDefinition {
        Name(NAME)

        Class(SharedConviva::class) {
            Constructor { error("Use ConvivaAnalytics to create an integration") }
        }

        AsyncFunction("create") { player: SharedPlayer?, customerKey: String, gatewayUrl: String?, debugLoggingEnabled: Boolean ->
            val config = ConvivaConfig()
            config.gatewayUrl = gatewayUrl
            config.isDebugLoggingEnabled = debugLoggingEnabled
            try {
                val convivaAnalytics = ConvivaAnalyticsIntegration(
                    player?.player,
                    customerKey,
                    appContext.reactContext,
                    config,
                )
                SharedConviva(appContext, convivaAnalytics, player)
            } catch (e: Exception) {
                throw InitializationFailedException(e)
            }
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("attachPlayer") { owner: SharedConviva, player: SharedPlayer ->
            owner.attach(player)
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("destroy") { owner: SharedConviva -> owner.release() }.runOnQueue(Queues.MAIN)

        AsyncFunction("release") { owner: SharedConviva -> owner.release() }.runOnQueue(Queues.MAIN)

        AsyncFunction("initializeSession") { owner: SharedConviva ->
            val convivaAnalytics = owner.requireAnalytics()
            
            try {
                convivaAnalytics.initializeSession()
            } catch (e: Exception) {
                throw SessionInitializationFailedException(e)
            }
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("endSession") { owner: SharedConviva ->
            val convivaAnalytics = owner.requireAnalytics()
            
            convivaAnalytics.endSession()
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("updateContentMetadata") { owner: SharedConviva, contentMetadata: Map<String, Any?> ->
            val convivaAnalytics = owner.requireAnalytics()
            
            convivaAnalytics.updateContentMetadata(contentMetadata.toMetadataOverrides())
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("sendCustomApplicationEvent") { owner: SharedConviva, name: String, attributes: Map<String, Any?> ->
            val convivaAnalytics = owner.requireAnalytics()
            
            convivaAnalytics.sendCustomApplicationEvent(name, attributes)
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("sendCustomPlaybackEvent") { owner: SharedConviva, name: String, attributes: Map<String, Any?> ->
            val convivaAnalytics = owner.requireAnalytics()
            
            convivaAnalytics.sendCustomPlaybackEvent(name, attributes)
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("reportPlaybackDeficiency") { owner: SharedConviva, message: String, severity: String, endSession: Boolean ->
            val convivaAnalytics = owner.requireAnalytics()
            
            val errorSeverity = severity.toErrorSeverity()
                ?: throw InvalidSeverityException(severity)
            
            convivaAnalytics.reportPlaybackDeficiency(message, errorSeverity, endSession)
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("pauseTracking") { owner: SharedConviva, isBumper: Boolean ->
            val convivaAnalytics = owner.requireAnalytics()
            
            convivaAnalytics.pauseTracking(isBumper)
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("resumeTracking") { owner: SharedConviva ->
            val convivaAnalytics = owner.requireAnalytics()
            
            convivaAnalytics.resumeTracking()
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("reportAppForegrounded") { owner: SharedConviva ->
            val convivaAnalytics = owner.requireAnalytics()
            
            convivaAnalytics.reportAppForegrounded()
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("reportAppBackgrounded") { owner: SharedConviva ->
            val convivaAnalytics = owner.requireAnalytics()
            
            convivaAnalytics.reportAppBackgrounded()
        }.runOnQueue(Queues.MAIN)

        // iOS only functions (no-op on Android)
        AsyncFunction("setPlayerViewRef") { _: SharedConviva, _: Int ->
            // No-op on Android
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("resetPlayerViewRef") { _: SharedConviva ->
            // No-op on Android
        }.runOnQueue(Queues.MAIN)
    }

    companion object {
        const val NAME = "BitmovinPlayerReactNativeAnalyticsConviva"
    }
}

internal class InitializationFailedException(cause: Throwable) :
    CodedException("Could not initialize Conviva Analytics: ${cause.message}", cause)

internal class SessionInitializationFailedException(cause: Throwable) :
    CodedException("Could not initialize session for Conviva Analytics: ${cause.message}", cause)

internal class InvalidSeverityException(severity: String) :
    CodedException("Invalid severity value \"$severity\"")
