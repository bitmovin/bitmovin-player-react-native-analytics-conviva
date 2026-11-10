import BitmovinConvivaAnalytics
import BitmovinPlayer
import ExpoModulesCore
import React
import RNBitmovinPlayer

public class BitmovinPlayerReactNativeAnalyticsConvivaModule: Module { // swiftlint:disable:this type_name
    // swiftlint:disable:next function_body_length
    public func definition() -> ModuleDefinition {
        Name("BitmovinPlayerReactNativeAnalyticsConviva")

        Class(SharedConviva.self) {}

        AsyncFunction("create") { (player: SharedPlayer?, customerKey: String, gatewayUrl: String?, debugLoggingEnabled: Bool) -> SharedConviva in // swiftlint:disable:this line_length
            let convivaConfig = ConvivaConfiguration()
            if let gatewayUrl {
                if let gatewayUrlValue = URL(string: gatewayUrl) {
                    convivaConfig.gatewayUrl = gatewayUrlValue
                } else {
                    throw Exception(
                        name: "InvalidGatewayUrl",
                        description: "Invalid gatewayUrl value \"\(gatewayUrl)\""
                    )
                }
            }
            if debugLoggingEnabled {
                convivaConfig.convivaLogLevel = .LOGLEVEL_DEBUG
            }
            convivaConfig.debugLoggingEnabled = debugLoggingEnabled

            do {
                let convivaAnalytics = try ConvivaAnalytics(
                    player: player?.player,
                    customerKey: customerKey,
                    config: convivaConfig
                )
                return SharedConviva(analytics: convivaAnalytics, player: player)
            } catch {
                throw Exception(
                    name: "InitializationFailed",
                    description: "Could not initialize Conviva Analytics: \(error.localizedDescription)"
                )
            }
        }
        .runOnQueue(.main)

        AsyncFunction("attachPlayer") { (owner: SharedConviva, player: SharedPlayer) -> Bool in
            try owner.attach(player)
        }
        .runOnQueue(.main)

        AsyncFunction("destroy") { (owner: SharedConviva) in owner.release() }
            .runOnQueue(.main)

        AsyncFunction("release") { (owner: SharedConviva) in owner.release() }
            .runOnQueue(.main)

        AsyncFunction("initializeSession") { (owner: SharedConviva) in
            let conviva = try owner.requireAnalytics()
            do {
                try conviva.initializeSession()
            } catch {
                throw Exception(
                    name: "SessionInitializationFailed",
                    description: """
                    Could not initialize session for Conviva Analytics: \(error.localizedDescription)
                    """
                )
            }
        }
        .runOnQueue(.main)

        AsyncFunction("endSession") { (owner: SharedConviva) in
            let conviva = try owner.requireAnalytics()
            conviva.endSession()
        }
        .runOnQueue(.main)

        AsyncFunction("updateContentMetadata") { (owner: SharedConviva, metadata: [String: Any]) in
            let conviva = try owner.requireAnalytics()
            guard let metadataOverride = RCTConvert.metadataOverrides(metadata) else {
                throw Exception(
                    name: "InvalidMetadata",
                    description: "Could not convert metadata to MetadataOverrides"
                )
            }
            conviva.updateContentMetadata(metadataOverrides: metadataOverride)
        }
        .runOnQueue(.main)

        AsyncFunction("sendCustomApplicationEvent") { (owner: SharedConviva, name: String, attributes: [String: Any]) in
            let conviva = try owner.requireAnalytics()
            let attributesStringDict = attributes.compactMapValues { $0 as? String }
            conviva.sendCustomApplicationEvent(name: name, attributes: attributesStringDict)
        }
        .runOnQueue(.main)

        AsyncFunction("sendCustomPlaybackEvent") { (owner: SharedConviva, name: String, attributes: [String: Any]) in
            let conviva = try owner.requireAnalytics()
            let attributesStringDict = attributes.compactMapValues { $0 as? String }
            conviva.sendCustomPlaybackEvent(name: name, attributes: attributesStringDict)
        }
        .runOnQueue(.main)

        AsyncFunction("reportPlaybackDeficiency") { (owner: SharedConviva, message: String, severity: String, endSession: Bool) in // swiftlint:disable:this line_length
            let conviva = try owner.requireAnalytics()
            guard let severityValue = RCTConvert.severity(severity) else {
                throw Exception(
                    name: "InvalidSeverity",
                    description: "Invalid severity value \"\(severity)\""
                )
            }
            // Reset metadata to align behavior with Android
            conviva.updateContentMetadata(metadataOverrides: MetadataOverrides())
            conviva.reportPlaybackDeficiency(
                message: message,
                severity: severityValue,
                endSession: endSession
            )
        }
        .runOnQueue(.main)

        AsyncFunction("pauseTracking") { (owner: SharedConviva, isBumper: Bool) in
            let conviva = try owner.requireAnalytics()
            conviva.pauseTracking(isBumper: isBumper)
        }
        .runOnQueue(.main)

        AsyncFunction("resumeTracking") { (owner: SharedConviva) in
            let conviva = try owner.requireAnalytics()
            conviva.resumeTracking()
        }
        .runOnQueue(.main)

        // iOS only functions
        AsyncFunction("setPlayerViewRef") { (owner: SharedConviva, playerViewRefId: Int) in
            let conviva = try owner.requireAnalytics()

            // Get the view from the view registry using the ref ID
            guard let appContext = self.appContext,
                  let wrapperView = appContext.findView(withTag: playerViewRefId, ofType: RNPlayerView.self),
                  let playerView = wrapperView.subviews.first(where: { $0 is PlayerView }) as? PlayerView  else {
                throw Exception(
                    name: "PlayerViewNotFound",
                    description: "Could not retrieve PlayerView with ref Id \(playerViewRefId)"
                )
            }

            conviva.playerView = playerView
        }
        .runOnQueue(.main)

        AsyncFunction("resetPlayerViewRef") { (owner: SharedConviva) in
            let conviva = try owner.requireAnalytics()
            conviva.playerView = nil
        }
        .runOnQueue(.main)

        // Android only functions (no-op on iOS)
        AsyncFunction("reportAppForegrounded") { (_: SharedConviva) in
            // No-op on iOS
        }
        .runOnQueue(.main)

        AsyncFunction("reportAppBackgrounded") { (_: SharedConviva) in
            // No-op on iOS
        }
        .runOnQueue(.main)
    }
}

private extension ConvivaAnalytics {
    convenience init(
        player: Player?,
        customerKey: String,
        config: ConvivaConfiguration
    ) throws {
        if let player {
            try self.init(
                player: player,
                customerKey: customerKey,
                config: config
            )
        } else {
            try self.init(
                customerKey: customerKey,
                config: config
            )
        }
    }
}
