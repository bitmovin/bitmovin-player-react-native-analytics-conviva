package com.bitmovin.player.reactnative.analytics.conviva.converter

import com.bitmovin.analytics.conviva.MetadataOverrides
import com.bitmovin.analytics.conviva.ssai.AdPosition
import com.bitmovin.analytics.conviva.ssai.SsaiApi
import com.bitmovin.player.reactnative.extensions.getDoubleOrNull
import com.bitmovin.player.reactnative.extensions.getIntOrNull
import com.bitmovin.player.reactnative.extensions.toMap
import com.conviva.sdk.ConvivaSdkConstants
import com.facebook.react.bridge.*

fun ReadableMap.toMetadataOverrides(): MetadataOverrides = MetadataOverrides().apply {
    assetName = getString("assetName")
    viewerId = getString("viewerId")
    streamType = getString("streamType")?.toStreamType()
    applicationName = getString("applicationName")
    custom = getMap("custom")?.toMap<String>()
    duration = getIntOrNull("duration")
    additionalStandardTags = getMap("additionalStandardTags")?.toMap()
    encodedFrameRate = getIntOrNull("encodedFrameRate")
    defaultResource = getString("defaultResource")
    streamUrl = getString("streamUrl")
    imaSdkVersion = getString("imaSdkVersion")
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

fun ReadableMap.toSsaiAdInfo(): SsaiApi.AdInfo = SsaiApi.AdInfo().apply {
    title = getString("title")
    getDoubleOrNull("duration")?.let { duration = it }
    id = getString("id")
    adSystem = getString("adSystem")
    getString("position")?.toAdPosition().let {
        position = it
    }
    isSlate = getBoolean("isSlate")
    adStitcher = getString("adStitcher")
    additionalMetadata = getMap("additionalMetadata")?.toMap()
}

private fun String?.toAdPosition(): AdPosition? = when (this) {
    "preroll" -> AdPosition.PREROLL
    "midroll" -> AdPosition.MIDROLL
    "postroll" -> AdPosition.POSTROLL
    else -> null
}
