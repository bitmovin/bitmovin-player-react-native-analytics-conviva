package com.bitmovin.player.reactnative.analytics.conviva

import com.bitmovin.analytics.conviva.ConvivaAnalyticsIntegration
import com.bitmovin.analytics.conviva.ConvivaConfig
import com.bitmovin.player.reactnative.PlayerRegistry
import com.bitmovin.player.reactnative.analytics.conviva.converter.toErrorSeverity
import com.bitmovin.player.reactnative.analytics.conviva.converter.toMetadataOverrides
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class BitmovinPlayerReactNativeAnalyticsConvivaModule : Module() {

    private val convivaAnalyticsInstances: Registry<ConvivaAnalyticsIntegration> = mutableMapOf()

    override fun definition() = ModuleDefinition {
        Name(NAME)

        AsyncFunction("initWithConfig") { nativeId: String, playerNativeId: String?, customerKey: String, gatewayUrl: String?, debugLoggingEnabled: Boolean ->
            val player = playerNativeId?.let { id ->
                PlayerRegistry.getPlayer(id) ?: throw PlayerNotFoundException(id)
            }

            val config = ConvivaConfig()
            config.gatewayUrl = gatewayUrl
            config.isDebugLoggingEnabled = debugLoggingEnabled
            try {
                val convivaAnalytics = ConvivaAnalyticsIntegration(
                    player,
                    customerKey,
                    appContext.reactContext,
                    config,
                )
                convivaAnalyticsInstances[nativeId] = convivaAnalytics
            } catch (e: Exception) {
                throw InitializationFailedException(nativeId, playerNativeId, customerKey, e)
            }
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("attachPlayer") { nativeId: String, playerNativeId: String ->
            val convivaAnalytics = getConvivaAnalyticsOrNull(nativeId)
                ?: throw ConvivaNotFoundException(nativeId)
            
            val player = PlayerRegistry.getPlayer(playerNativeId)
                ?: throw PlayerNotFoundException(playerNativeId)

            convivaAnalytics.attachPlayer(player)
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("destroy") { nativeId: String ->
            val convivaAnalytics = getConvivaAnalyticsOrNull(nativeId)
                ?: throw ConvivaNotFoundException(nativeId)
            
            convivaAnalytics.release()
            convivaAnalyticsInstances.remove(nativeId)
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("release") { nativeId: String ->
            val convivaAnalytics = getConvivaAnalyticsOrNull(nativeId)
                ?: throw ConvivaNotFoundException(nativeId)
            
            convivaAnalytics.release()
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("initializeSession") { nativeId: String ->
            val convivaAnalytics = getConvivaAnalyticsOrNull(nativeId)
                ?: throw ConvivaNotFoundException(nativeId)
            
            try {
                convivaAnalytics.initializeSession()
            } catch (e: Exception) {
                throw SessionInitializationFailedException(nativeId, e)
            }
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("endSession") { nativeId: String ->
            val convivaAnalytics = getConvivaAnalyticsOrNull(nativeId)
                ?: throw ConvivaNotFoundException(nativeId)
            
            convivaAnalytics.endSession()
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("updateContentMetadata") { nativeId: String, contentMetadata: Map<String, Any?> ->
            val convivaAnalytics = getConvivaAnalyticsOrNull(nativeId)
                ?: throw ConvivaNotFoundException(nativeId)
            
            convivaAnalytics.updateContentMetadata(contentMetadata.toMetadataOverrides())
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("sendCustomApplicationEvent") { nativeId: String, name: String, attributes: Map<String, Any?> ->
            val convivaAnalytics = getConvivaAnalyticsOrNull(nativeId)
                ?: throw ConvivaNotFoundException(nativeId)
            
            convivaAnalytics.sendCustomApplicationEvent(name, attributes)
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("sendCustomPlaybackEvent") { nativeId: String, name: String, attributes: Map<String, Any?> ->
            val convivaAnalytics = getConvivaAnalyticsOrNull(nativeId)
                ?: throw ConvivaNotFoundException(nativeId)
            
            convivaAnalytics.sendCustomPlaybackEvent(name, attributes)
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("reportPlaybackDeficiency") { nativeId: String, message: String, severity: String, endSession: Boolean ->
            val convivaAnalytics = getConvivaAnalyticsOrNull(nativeId)
                ?: throw ConvivaNotFoundException(nativeId)
            
            val errorSeverity = severity.toErrorSeverity()
                ?: throw InvalidSeverityException(severity)
            
            convivaAnalytics.reportPlaybackDeficiency(message, errorSeverity, endSession)
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("pauseTracking") { nativeId: String, isBumper: Boolean ->
            val convivaAnalytics = getConvivaAnalyticsOrNull(nativeId)
                ?: throw ConvivaNotFoundException(nativeId)
            
            convivaAnalytics.pauseTracking(isBumper)
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("resumeTracking") { nativeId: String ->
            val convivaAnalytics = getConvivaAnalyticsOrNull(nativeId)
                ?: throw ConvivaNotFoundException(nativeId)
            
            convivaAnalytics.resumeTracking()
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("reportAppForegrounded") { nativeId: String ->
            val convivaAnalytics = getConvivaAnalyticsOrNull(nativeId)
                ?: throw ConvivaNotFoundException(nativeId)
            
            convivaAnalytics.reportAppForegrounded()
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("reportAppBackgrounded") { nativeId: String ->
            val convivaAnalytics = getConvivaAnalyticsOrNull(nativeId)
                ?: throw ConvivaNotFoundException(nativeId)
            
            convivaAnalytics.reportAppBackgrounded()
        }.runOnQueue(Queues.MAIN)

        // iOS only functions (no-op on Android)
        AsyncFunction("setPlayerViewRef") { _: String, _: Int ->
            // No-op on Android
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("resetPlayerViewRef") { _: String ->
            // No-op on Android
        }.runOnQueue(Queues.MAIN)
    }

    internal fun getConvivaAnalyticsOrNull(nativeId: String): ConvivaAnalyticsIntegration? {
        return convivaAnalyticsInstances[nativeId]
    }

    companion object {
        const val NAME = "BitmovinPlayerReactNativeAnalyticsConviva"
    }
}

// Exception classes
internal class PlayerNotFoundException(playerId: String) :
    CodedException("Could not retrieve Player with native Id $playerId")

internal class ConvivaNotFoundException(nativeId: String) :
    CodedException("Could not retrieve Conviva Analytics instance with native Id $nativeId")

internal class InitializationFailedException(
    nativeId: String,
    playerNativeId: String?,
    customerKey: String,
    cause: Throwable
) : CodedException(
    "Could not initialize Conviva Analytics with native Id $nativeId " +
    "using playerNativeId ${playerNativeId ?: "null"} and customerKey $customerKey: ${cause.message}"
)

internal class SessionInitializationFailedException(nativeId: String, cause: Throwable) :
    CodedException("Could not initialize session for Conviva Analytics with native Id $nativeId: ${cause.message}")

internal class InvalidSeverityException(severity: String) :
    CodedException("Invalid severity value \"$severity\"")
