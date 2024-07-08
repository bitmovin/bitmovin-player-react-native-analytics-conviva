package com.bitmovin.player.reactnative.analytics.conviva

import android.util.Log
import com.bitmovin.analytics.conviva.ConvivaAnalyticsIntegration
import com.bitmovin.player.reactnative.analytics.conviva.extensions.convivaModule
import com.bitmovin.player.reactnative.analytics.conviva.extensions.uiManagerModule
import com.facebook.react.bridge.*
import com.facebook.react.uimanager.UIManagerModule

private const val MODULE_NAME = "BitmovinBaseModule"

/**
 * Base for Bitmovin React modules.
 *
 * Provides many helper methods that are promise exception safe.
 *
 * In general, code should not throw while resolving a [Promise]. Instead, [Promise.reject] should be used.
 * This doesn't match Kotlin's error style, which uses exception. The helper methods in this class, provide such
 * convenience, they can only be called in a context that will catch any Exception and reject the [Promise].
 *
 */
abstract class BitmovinBaseModule(
    protected val context: ReactApplicationContext,
) : ReactContextBaseJavaModule(context) {
    /**
     * Runs [block] on the UI thread with [UIManagerModule.addUIBlock] and [TPromise.resolve] [this] with
     * its return value. If [block] throws, [Promise.reject] [this] with the [Throwable].
     */
    protected inline fun <T, R : T> TPromise<T>.resolveOnUiThread(
        crossinline block: RejectPromiseOnExceptionBlock.() -> R,
    ) {
        val uiManager = runAndRejectOnException { uiManager } ?: return
        uiManager.addUIBlock {
            resolveOnCurrentThread { block() }
        }
    }
    protected val RejectPromiseOnExceptionBlock.uiManager: UIManagerModule get() = context.uiManagerModule
        ?: throw IllegalStateException("UIManager not found")

    protected val RejectPromiseOnExceptionBlock.convivaModule: BitmovinPlayerReactNativeAnalyticsConvivaModule
        get() = context.convivaModule
            ?: throw IllegalStateException("UIManager not found")

    protected inline fun <T> TPromise<T>.resolveOnUiThreadWithConvivaAnalytics(
        nativeId: NativeId,
        crossinline block: ConvivaAnalyticsIntegration.() -> T,
    ) = resolveOnUiThread {
        getConvivaAnalytics(nativeId, convivaModule).block()
    }

    fun RejectPromiseOnExceptionBlock.getConvivaAnalytics(
        nativeId: NativeId,
        convivaModule: BitmovinPlayerReactNativeAnalyticsConvivaModule = this.convivaModule,
    ): ConvivaAnalyticsIntegration {
        return convivaModule.getConvivaAnalyticsOrNull(nativeId) ?: throw IllegalArgumentException(
            "Invalid BitmovinPlayerReactNativeAnalyticsConviva $nativeId",
        )
    }
}

/** Run [block], returning it's return value. If [block] throws, [Promise.reject] [this] and return null. */
inline fun <T, R> TPromise<T>.runAndRejectOnException(block: RejectPromiseOnExceptionBlock.() -> R): R? = try {
    RejectPromiseOnExceptionBlock.block()
} catch (e: Exception) {
    reject(e)
    null
}

/**
 * [TPromise.resolve] [this] with [block] return value.
 * If [block] throws, [Promise.reject] [this] with the [Throwable].
 */
inline fun <T> TPromise<T>.resolveOnCurrentThread(
    crossinline block: RejectPromiseOnExceptionBlock.() -> T,
): Unit = runAndRejectOnException { this@resolveOnCurrentThread.resolve(block()) } ?: Unit

/** Receiver of code that can safely throw when resolving a [Promise]. */
object RejectPromiseOnExceptionBlock

/** Compile time wrapper for Promises to type check the resolved type [T]. */
@JvmInline
value class TPromise<T>(val promise: Promise) {
    // Promise only support built-in types. Functions that return [Unit] must resolve to `null`.
    fun resolve(value: T): Unit = promise.resolve(value.takeUnless { it is Unit })
    fun reject(throwable: Throwable) {
        Log.e(MODULE_NAME, "Failed to execute Bitmovin method", throwable)
        promise.reject(throwable)
    }
}

inline val Promise.int get() = TPromise<Int>(this)
inline val Promise.unit get() = TPromise<Unit>(this)
inline val Promise.string get() = TPromise<String>(this)
inline val Promise.double get() = TPromise<Double>(this)
inline val Promise.float get() = TPromise<Float>(this)
inline val Promise.bool get() = TPromise<Boolean>(this)
inline val Promise.map get() = TPromise<ReadableMap>(this)
inline val Promise.array get() = TPromise<ReadableArray>(this)
inline val <T> TPromise<T>.nullable get() = TPromise<T?>(promise)
