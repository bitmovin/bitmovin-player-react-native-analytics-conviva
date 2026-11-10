package com.bitmovin.player.reactnative.analytics.conviva

import com.bitmovin.player.reactnative.analytics.conviva.converter.toSsaiAdInfo
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule : Module() {
    override fun definition() = ModuleDefinition {
        Name(NAME)

        AsyncFunction("isAdBreakActive") { owner: SharedConviva ->
            val convivaAnalytics = owner.requireAnalytics()
            
            val ssaiApi = convivaAnalytics.ssai
                ?: throw SsaiNotAvailableException()
            
            return@AsyncFunction ssaiApi.isAdBreakActive
        }
            .runOnQueue(Queues.MAIN)

        AsyncFunction("reportAdBreakStarted") { owner: SharedConviva, adBreakInfo: Map<String, Any?>? ->
            val convivaAnalytics = owner.requireAnalytics()
            
            val ssaiApi = convivaAnalytics.ssai
                ?: throw SsaiNotAvailableException()
            
            ssaiApi.reportAdBreakStarted(adBreakInfo)
        }
            .runOnQueue(Queues.MAIN)

        AsyncFunction("reportAdBreakFinished") { owner: SharedConviva ->
            val convivaAnalytics = owner.requireAnalytics()
            
            val ssaiApi = convivaAnalytics.ssai
                ?: throw SsaiNotAvailableException()
            
            ssaiApi.reportAdBreakFinished()
        }
            .runOnQueue(Queues.MAIN)

        AsyncFunction("reportAdStarted") { owner: SharedConviva, adInfo: Map<String, Any?> ->
            val convivaAnalytics = owner.requireAnalytics()
            
            val ssaiApi = convivaAnalytics.ssai
                ?: throw SsaiNotAvailableException()
            
            ssaiApi.reportAdStarted(adInfo.toSsaiAdInfo())
        }
            .runOnQueue(Queues.MAIN)

        AsyncFunction("reportAdFinished") { owner: SharedConviva ->
            val convivaAnalytics = owner.requireAnalytics()
            
            val ssaiApi = convivaAnalytics.ssai
                ?: throw SsaiNotAvailableException()
            
            ssaiApi.reportAdFinished()
        }
            .runOnQueue(Queues.MAIN)

        AsyncFunction("reportAdSkipped") { owner: SharedConviva ->
            val convivaAnalytics = owner.requireAnalytics()
            
            val ssaiApi = convivaAnalytics.ssai
                ?: throw SsaiNotAvailableException()
            
            ssaiApi.reportAdSkipped()
        }
            .runOnQueue(Queues.MAIN)

        AsyncFunction("updateAdInfo") { owner: SharedConviva, adInfo: Map<String, Any?> ->
            val convivaAnalytics = owner.requireAnalytics()
            
            val ssaiApi = convivaAnalytics.ssai
                ?: throw SsaiNotAvailableException()
            
            ssaiApi.updateAdInfo(adInfo.toSsaiAdInfo())
        }
            .runOnQueue(Queues.MAIN)
    }

    companion object {
        const val NAME = "BitmovinPlayerReactNativeAnalyticsConvivaSsai"
    }
}

internal class SsaiNotAvailableException :
    CodedException("SSAI API not available for this Conviva Analytics instance")
