package com.bitmovin.player.reactnative.analytics.conviva.converter

import com.bitmovin.analytics.conviva.MetadataOverrides
import com.bitmovin.analytics.conviva.ssai.AdPosition
import com.bitmovin.analytics.conviva.ssai.SsaiApi
import com.bitmovin.player.reactnative.analytics.conviva.extensions.getBooleanOrNull
import com.bitmovin.player.reactnative.analytics.conviva.extensions.getDoubleOrNull
import com.bitmovin.player.reactnative.analytics.conviva.extensions.getIntOrNull
import com.bitmovin.player.reactnative.analytics.conviva.extensions.getMap
import com.bitmovin.player.reactnative.analytics.conviva.extensions.getString
import com.bitmovin.player.reactnative.analytics.conviva.extensions.toMap
import com.conviva.sdk.ConvivaSdkConstants
import com.facebook.react.bridge.ReadableMap

fun Map<String, Any?>.toMetadataOverrides(): MetadataOverrides = MetadataOverrides().apply {
    assetName = getString("assetName")
    viewerId = getString("viewerId")
    streamType = getString("streamType")?.toStreamType()
    applicationName = getString("applicationName")
    custom = getMap("custom")?.toMap<String>()
    duration = getIntOrNull("duration")
    additionalStandardTags = getMap("additionalStandardTags")
    encodedFrameRate = getIntOrNull("encodedFrameRate")
    defaultResource = getString("defaultResource")
    streamUrl = getString("streamUrl")
    imaSdkVersion = getString("imaSdkVersion")
}

// Legacy ReadableMap support - converts to Map and delegates
fun ReadableMap.toMetadataOverrides(): MetadataOverrides {
    val map = mutableMapOf<String, Any?>()
    val iterator = entryIterator
    while (iterator.hasNext()) {
        val entry = iterator.next()
        map[entry.key] = entry.value
    }
    return map.toMetadataOverrides()
}

fun Map<String, Any?>.toSsaiAdInfo(): SsaiApi.AdInfo = SsaiApi.AdInfo().apply {
    title = getString("title")
    getDoubleOrNull("duration")?.let { duration = it }
    id = getString("id")
    adSystem = getString("adSystem")
    getString("position")?.toAdPosition().let {
        position = it
    }
    isSlate = getBooleanOrNull("isSlate") ?: false
    adStitcher = getString("adStitcher")
    additionalMetadata = getMap("additionalMetadata")
}

// Legacy ReadableMap support - converts to Map and delegates
fun ReadableMap.toSsaiAdInfo(): SsaiApi.AdInfo {
    val map = mutableMapOf<String, Any?>()
    val iterator = entryIterator
    while (iterator.hasNext()) {
        val entry = iterator.next()
        map[entry.key] = entry.value
    }
    return map.toSsaiAdInfo()
}

private fun String?.toStreamType(): ConvivaSdkConstants.StreamType? = when (this) {
    "UNKNOWN" -> ConvivaSdkConstants.StreamType.UNKNOWN
    "LIVE" -> ConvivaSdkConstants.StreamType.LIVE
    "VOD" -> ConvivaSdkConstants.StreamType.VOD
    else -> null
}

fun String?.toErrorSeverity(): ConvivaSdkConstants.ErrorSeverity? = when (this) {
    "FATAL" -> ConvivaSdkConstants.ErrorSeverity.FATAL
    "WARNING" -> ConvivaSdkConstants.ErrorSeverity.WARNING
    else -> null
}

private fun String?.toAdPosition(): AdPosition? = when (this) {
    "preroll" -> AdPosition.PREROLL
    "midroll" -> AdPosition.MIDROLL
    "postroll" -> AdPosition.POSTROLL
    else -> null
}
