import BitmovinConvivaAnalytics
import ExpoModulesCore

public class BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule: Module { // swiftlint:disable:this type_name
    // swiftlint:disable:next function_body_length
    public func definition() -> ModuleDefinition {
        Name("BitmovinPlayerReactNativeAnalyticsConvivaSsai")

        AsyncFunction("isAdBreakActive") { (nativeId: NativeId) -> Bool in
            guard let convivaAnalytics = self.retrieveConvivaAnalytics(nativeId) else {
                throw Exception(
                    name: "ConvivaNotFound",
                    description: "Could not retrieve ConvivaAnalytics with native Id \(nativeId)"
                )
            }
            return convivaAnalytics.ssai.isAdBreakActive
        }
        .runOnQueue(.main)

        AsyncFunction("reportAdBreakStarted") { (nativeId: NativeId, adBreakInfo: [String: Any]?) in
            guard let convivaAnalytics = self.retrieveConvivaAnalytics(nativeId) else {
                throw Exception(
                    name: "ConvivaNotFound",
                    description: "Could not retrieve ConvivaAnalytics with native Id \(nativeId)"
                )
            }

            if let adBreakInfo {
                convivaAnalytics.ssai.reportAdBreakStarted(adBreakInfo: adBreakInfo)
            } else {
                convivaAnalytics.ssai.reportAdBreakStarted()
            }
        }
        .runOnQueue(.main)

        AsyncFunction("reportAdBreakFinished") { (nativeId: NativeId) in
            guard let convivaAnalytics = self.retrieveConvivaAnalytics(nativeId) else {
                throw Exception(
                    name: "ConvivaNotFound",
                    description: "Could not retrieve ConvivaAnalytics with native Id \(nativeId)"
                )
            }

            convivaAnalytics.ssai.reportAdBreakFinished()
        }
        .runOnQueue(.main)

        AsyncFunction("reportAdStarted") { (nativeId: NativeId, adInfo: [String: Any]) in
            guard let convivaAnalytics = self.retrieveConvivaAnalytics(nativeId) else {
                throw Exception(
                    name: "ConvivaNotFound",
                    description: "Could not retrieve ConvivaAnalytics with native Id \(nativeId)"
                )
            }

            convivaAnalytics.ssai.reportAdStarted(adInfo: RCTConvert.adInfo(adInfo))
        }
        .runOnQueue(.main)

        AsyncFunction("reportAdFinished") { (nativeId: NativeId) in
            guard let convivaAnalytics = self.retrieveConvivaAnalytics(nativeId) else {
                throw Exception(
                    name: "ConvivaNotFound",
                    description: "Could not retrieve ConvivaAnalytics with native Id \(nativeId)"
                )
            }

            convivaAnalytics.ssai.reportAdFinished()
        }
        .runOnQueue(.main)

        AsyncFunction("reportAdSkipped") { (nativeId: NativeId) in
            guard let convivaAnalytics = self.retrieveConvivaAnalytics(nativeId) else {
                throw Exception(
                    name: "ConvivaNotFound",
                    description: "Could not retrieve ConvivaAnalytics with native Id \(nativeId)"
                )
            }

            convivaAnalytics.ssai.reportAdSkipped()
        }
        .runOnQueue(.main)

        AsyncFunction("updateAdInfo") { (nativeId: NativeId, adInfo: [String: Any]) in
            guard let convivaAnalytics = self.retrieveConvivaAnalytics(nativeId) else {
                throw Exception(
                    name: "ConvivaNotFound",
                    description: "Could not retrieve ConvivaAnalytics with native Id \(nativeId)"
                )
            }
            convivaAnalytics.ssai.update(adInfo: RCTConvert.adInfo(adInfo))
        }
        .runOnQueue(.main)
    }

    private func retrieveConvivaAnalytics(_ nativeId: NativeId) -> ConvivaAnalytics? {
        guard let appContext,
              let convivaModule = appContext
            .moduleRegistry.get(BitmovinPlayerReactNativeAnalyticsConvivaModule.self) else {
            return nil
        }
        return convivaModule.retrieve(nativeId)
    }
}
