package com.bitmovin.player.reactnative.analytics.conviva

import com.bitmovin.analytics.conviva.ConvivaAnalyticsIntegration
import com.bitmovin.player.reactnative.SharedPlayer
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.sharedobjects.SharedObject
import kotlinx.coroutines.Dispatchers
import kotlin.coroutines.EmptyCoroutineContext

class SharedConviva(
    appContext: AppContext,
    private var analytics: ConvivaAnalyticsIntegration?,
    private var player: SharedPlayer?,
) : SharedObject(appContext) {
    fun requireAnalytics(): ConvivaAnalyticsIntegration =
        analytics ?: throw ConvivaReleasedException()

    fun attach(player: SharedPlayer): Boolean {
        val analytics = requireAnalytics()
        if (this.player != null) return false
        analytics.attachPlayer(player.player)
        this.player = player
        return true
    }

    fun release() {
        try {
            analytics?.release()
        } finally {
            analytics = null
            player = null
        }
    }

    override fun sharedObjectDidRelease() {
        Dispatchers.Main.dispatch(EmptyCoroutineContext) { release() }
    }
}

internal class ConvivaReleasedException : CodedException("Conviva Analytics has been released")
