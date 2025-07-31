package com.bitmovin.player.reactnative.analytics.conviva

import com.bitmovin.analytics.conviva.ConvivaAnalyticsIntegration
import com.bitmovin.player.reactnative.analytics.conviva.converter.toSsaiAdInfo
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule : Module() {
    override fun definition() = ModuleDefinition {
        Name(NAME)

        AsyncFunction("isAdBreakActive") { nativeId: String ->
            val convivaAnalytics = getConvivaAnalyticsOrNull(nativeId)
                ?: throw ConvivaNotFoundException(nativeId)
            
            val ssaiApi = convivaAnalytics.ssai
                ?: throw SsaiNotAvailableException(nativeId)
            
            return@AsyncFunction ssaiApi.isAdBreakActive
        }
            .runOnQueue(Queues.MAIN)

        AsyncFunction("reportAdBreakStarted") { nativeId: String, adBreakInfo: Map<String, Any?>? ->
            val convivaAnalytics = getConvivaAnalyticsOrNull(nativeId)
                ?: throw ConvivaNotFoundException(nativeId)
            
            val ssaiApi = convivaAnalytics.ssai
                ?: throw SsaiNotAvailableException(nativeId)
            
            ssaiApi.reportAdBreakStarted(adBreakInfo)
        }
            .runOnQueue(Queues.MAIN)

        AsyncFunction("reportAdBreakFinished") { nativeId: String ->
            val convivaAnalytics = getConvivaAnalyticsOrNull(nativeId)
                ?: throw ConvivaNotFoundException(nativeId)
            
            val ssaiApi = convivaAnalytics.ssai
                ?: throw SsaiNotAvailableException(nativeId)
            
            ssaiApi.reportAdBreakFinished()
        }
            .runOnQueue(Queues.MAIN)

        AsyncFunction("reportAdStarted") { nativeId: String, adInfo: Map<String, Any?> ->
            val convivaAnalytics = getConvivaAnalyticsOrNull(nativeId)
                ?: throw ConvivaNotFoundException(nativeId)
            
            val ssaiApi = convivaAnalytics.ssai
                ?: throw SsaiNotAvailableException(nativeId)
            
            ssaiApi.reportAdStarted(adInfo.toSsaiAdInfo())
        }
            .runOnQueue(Queues.MAIN)

        AsyncFunction("reportAdFinished") { nativeId: String ->
            val convivaAnalytics = getConvivaAnalyticsOrNull(nativeId)
                ?: throw ConvivaNotFoundException(nativeId)
            
            val ssaiApi = convivaAnalytics.ssai
                ?: throw SsaiNotAvailableException(nativeId)
            
            ssaiApi.reportAdFinished()
        }
            .runOnQueue(Queues.MAIN)

        AsyncFunction("reportAdSkipped") { nativeId: String ->
            val convivaAnalytics = getConvivaAnalyticsOrNull(nativeId)
                ?: throw ConvivaNotFoundException(nativeId)
            
            val ssaiApi = convivaAnalytics.ssai
                ?: throw SsaiNotAvailableException(nativeId)
            
            ssaiApi.reportAdSkipped()
        }
            .runOnQueue(Queues.MAIN)

        AsyncFunction("updateAdInfo") { nativeId: String, adInfo: Map<String, Any?> ->
            val convivaAnalytics = getConvivaAnalyticsOrNull(nativeId)
                ?: throw ConvivaNotFoundException(nativeId)
            
            val ssaiApi = convivaAnalytics.ssai
                ?: throw SsaiNotAvailableException(nativeId)
            
            ssaiApi.updateAdInfo(adInfo.toSsaiAdInfo())
        }
            .runOnQueue(Queues.MAIN)
    }

    private fun getConvivaAnalyticsOrNull(nativeId: String): ConvivaAnalyticsIntegration? {
        return appContext.registry.getModule<BitmovinPlayerReactNativeAnalyticsConvivaModule>()
            ?.getConvivaAnalyticsOrNull(nativeId)
    }

    companion object {
        const val NAME = "BitmovinPlayerReactNativeAnalyticsConvivaSsai"
    }
}

// Exception classes
internal class SsaiNotAvailableException(nativeId: String) :
    CodedException("SSAI API not available for Conviva Analytics instance with native Id $nativeId")
