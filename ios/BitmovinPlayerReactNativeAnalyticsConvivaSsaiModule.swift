import BitmovinConvivaAnalytics
import ExpoModulesCore
import React

public class BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule: Module { // swiftlint:disable:this type_name
    public func definition() -> ModuleDefinition {
        Name("BitmovinPlayerReactNativeAnalyticsConvivaSsai")

        AsyncFunction("isAdBreakActive") { (owner: SharedConviva) -> Bool in
            let convivaAnalytics = try owner.requireAnalytics()
            return convivaAnalytics.ssai.isAdBreakActive
        }
        .runOnQueue(.main)

        AsyncFunction("reportAdBreakStarted") { (owner: SharedConviva, adBreakInfo: [String: Any]?) in
            let convivaAnalytics = try owner.requireAnalytics()

            if let adBreakInfo {
                convivaAnalytics.ssai.reportAdBreakStarted(adBreakInfo: adBreakInfo)
            } else {
                convivaAnalytics.ssai.reportAdBreakStarted()
            }
        }
        .runOnQueue(.main)

        AsyncFunction("reportAdBreakFinished") { (owner: SharedConviva) in
            let convivaAnalytics = try owner.requireAnalytics()

            convivaAnalytics.ssai.reportAdBreakFinished()
        }
        .runOnQueue(.main)

        AsyncFunction("reportAdStarted") { (owner: SharedConviva, adInfo: [String: Any]) in
            let convivaAnalytics = try owner.requireAnalytics()

            convivaAnalytics.ssai.reportAdStarted(adInfo: RCTConvert.adInfo(adInfo))
        }
        .runOnQueue(.main)

        AsyncFunction("reportAdFinished") { (owner: SharedConviva) in
            let convivaAnalytics = try owner.requireAnalytics()

            convivaAnalytics.ssai.reportAdFinished()
        }
        .runOnQueue(.main)

        AsyncFunction("reportAdSkipped") { (owner: SharedConviva) in
            let convivaAnalytics = try owner.requireAnalytics()

            convivaAnalytics.ssai.reportAdSkipped()
        }
        .runOnQueue(.main)

        AsyncFunction("updateAdInfo") { (owner: SharedConviva, adInfo: [String: Any]) in
            let convivaAnalytics = try owner.requireAnalytics()
            convivaAnalytics.ssai.update(adInfo: RCTConvert.adInfo(adInfo))
        }
        .runOnQueue(.main)
    }
}
