import BitmovinConvivaAnalytics
import React

@objc(BitmovinPlayerReactNativeAnalyticsConvivaSsai)
public class BitmovinPlayerReactNativeAnalyticsConvivaSsai: NSObject, RCTBridgeModule { // swiftlint:disable:this type_name line_length
    // swiftlint:disable:next implicitly_unwrapped_optional
    @objc public var bridge: RCTBridge!

    // swiftlint:disable:next implicitly_unwrapped_optional
    public static func moduleName() -> String! {
        "BitmovinPlayerReactNativeAnalyticsConvivaSsai"
    }

    public static func requiresMainQueueSetup() -> Bool {
        true
    }

    // swiftlint:disable:next implicitly_unwrapped_optional
    public var methodQueue: DispatchQueue! {
        bridge.uiManager.methodQueue
    }

    private func retrieveConvivaAnalytics(_ nativeId: NativeId) -> ConvivaAnalytics? {
        bridge[BitmovinPlayerReactNativeAnalyticsConviva.self]?.retrieve(nativeId)
    }

    @objc(isAdBreakActive:)
    func isAdBreakActive(_ nativeId: NativeId) -> Bool {
        guard let convivaAnalytics = retrieveConvivaAnalytics(nativeId) else {
            return false
        }
        return convivaAnalytics.ssai.isAdBreakActive
    }

    @objc(reportAdBreakStarted:adBreakInfo:resolver:rejecter:)
    func reportAdBreakStarted(
        _ nativeId: NativeId,
        adBreakInfo: [String: Any]?,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let convivaAnalytics = retrieveConvivaAnalytics(nativeId) else {
            reject(
                Self.moduleName(),
                "Could not retrieve ConvivaAnalytics with native Id \(nativeId)",
                nil
            )
            return
        }

        convivaAnalytics.ssai.reportAdBreakStarted(adBreakInfo: adBreakInfo)
        resolve(nil)
    }

    @objc(reportAdBreakFinished:resolver:rejecter:)
    func reportAdBreakFinished(
        _ nativeId: NativeId,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let convivaAnalytics = retrieveConvivaAnalytics(nativeId) else {
            reject(
                Self.moduleName(),
                "Could not retrieve ConvivaAnalytics with native Id \(nativeId)",
                nil
            )
            return
        }

        convivaAnalytics.ssai.reportAdBreakFinished()
        resolve(nil)
    }

    @objc(reportAdStarted:adInfo:resolver:rejecter:)
    func reportAdStarted(
        _ nativeId: NativeId,
        adInfo: [String: Any],
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let convivaAnalytics = retrieveConvivaAnalytics(nativeId) else {
            reject(
                Self.moduleName(),
                "Could not retrieve ConvivaAnalytics with native Id \(nativeId)",
                nil
            )
            return
        }

        convivaAnalytics.ssai.reportAdStarted(adInfo: RCTConvert.adInfo(adInfo))
        resolve(nil)
    }

    @objc(reportAdFinished:resolver:rejecter:)
    func reportAdFinished(
        _ nativeId: NativeId,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let convivaAnalytics = retrieveConvivaAnalytics(nativeId) else {
            reject(
                Self.moduleName(),
                "Could not retrieve ConvivaAnalytics with native Id \(nativeId)",
                nil
            )
            return
        }

        convivaAnalytics.ssai.reportAdFinished()
        resolve(nil)
    }

    @objc(reportAdSkipped:resolver:rejecter:)
    func reportAdSkipped(
        _ nativeId: NativeId,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let convivaAnalytics = retrieveConvivaAnalytics(nativeId) else {
            reject(
                Self.moduleName(),
                "Could not retrieve ConvivaAnalytics with native Id \(nativeId)",
                nil
            )
            return
        }

        convivaAnalytics.ssai.reportAdSkipped()
        resolve(nil)
    }

    @objc(updateAdInfo:adInfo:resolver:rejecter:)
    func updateAdInfo(
        _ nativeId: NativeId,
        adInfo: [String: Any],
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let convivaAnalytics = retrieveConvivaAnalytics(nativeId) else {
            reject(
                Self.moduleName(),
                "Could not retrieve ConvivaAnalytics with native Id \(nativeId)",
                nil
            )
            return
        }

        convivaAnalytics.ssai.update(adInfo: RCTConvert.adInfo(adInfo))
        resolve(nil)
    }
}
