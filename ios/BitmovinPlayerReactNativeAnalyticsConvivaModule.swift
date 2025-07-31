import BitmovinConvivaAnalytics
import BitmovinPlayerCore
import ExpoModulesCore
import RNBitmovinPlayer

public class BitmovinPlayerReactNativeAnalyticsConvivaModule: Module { // swiftlint:disable:this type_name
    private var convivaAnalyticsInstances: Registry<ConvivaAnalytics> = [:]

    // swiftlint:disable:next function_body_length cyclomatic_complexity
    public func definition() -> ModuleDefinition {
        Name("BitmovinPlayerReactNativeAnalyticsConviva")

        AsyncFunction("initWithConfig") { (nativeId: NativeId, playerNativeId: NativeId?, customerKey: String, gatewayUrl: String?, debugLoggingEnabled: Bool) in // swiftlint:disable:this line_length
            let player: Player?
            if let playerNativeId {
                guard let playerByNativeId = PlayerRegistry.getPlayer(nativeId: playerNativeId) else {
                    throw Exception(
                        name: "PlayerNotFound",
                        description: "Could not retrieve Player with native Id \(playerNativeId)"
                    )
                }
                player = playerByNativeId
            } else {
                player = nil
            }

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
                    player: player,
                    customerKey: customerKey,
                    config: convivaConfig
                )
                self.convivaAnalyticsInstances[nativeId] = convivaAnalytics
            } catch {
                throw Exception(
                    name: "InitializationFailed",
                    description: """
                    Could not initialize Conviva Analytics with native Id \(nativeId) \
                    using playerNativeId \(playerNativeId ?? "nil") \
                    and customerKey \(customerKey): \(error.localizedDescription)
                    """
                )
            }
        }
        .runOnQueue(.main)

        AsyncFunction("attachPlayer") { (nativeId: NativeId, playerNativeId: NativeId) in
            guard let conviva = self.retrieve(nativeId) else {
                throw Exception(
                    name: "ConvivaNotFound",
                    description: "Could not retrieve Conviva Analytics instance with native Id \(nativeId)"
                )
            }
            guard let player = PlayerRegistry.getPlayer(nativeId: playerNativeId) else {
                throw Exception(
                    name: "PlayerNotFound",
                    description: "Could not retrieve Player with native Id \(playerNativeId)"
                )
            }
            conviva.attach(player: player)
        }
        .runOnQueue(.main)

        AsyncFunction("destroy") { (nativeId: NativeId) in
            self.convivaAnalyticsInstances[nativeId]?.release()
            self.convivaAnalyticsInstances.removeValue(forKey: nativeId)
        }
        .runOnQueue(.main)

        AsyncFunction("release") { (nativeId: NativeId) in
            guard let conviva = self.retrieve(nativeId) else {
                throw Exception(
                    name: "ConvivaNotFound",
                    description: "Could not retrieve Conviva Analytics instance with native Id \(nativeId)"
                )
            }
            conviva.release()
        }
        .runOnQueue(.main)

        AsyncFunction("initializeSession") { (nativeId: NativeId) in
            guard let conviva = self.retrieve(nativeId) else {
                throw Exception(
                    name: "ConvivaNotFound",
                    description: "Could not retrieve Conviva Analytics instance with native Id \(nativeId)"
                )
            }
            do {
                try conviva.initializeSession()
            } catch {
                throw Exception(
                    name: "SessionInitializationFailed",
                    description: """
                    Could not initialize session for Conviva Analytics with \
                    native Id \(nativeId): \(error.localizedDescription)
                    """
                )
            }
        }
        .runOnQueue(.main)

        AsyncFunction("endSession") { (nativeId: NativeId) in
            guard let conviva = self.retrieve(nativeId) else {
                throw Exception(
                    name: "ConvivaNotFound",
                    description: "Could not retrieve Conviva Analytics instance with native Id \(nativeId)"
                )
            }
            conviva.endSession()
        }
        .runOnQueue(.main)

        AsyncFunction("updateContentMetadata") { (nativeId: NativeId, metadata: [String: Any]) in
            guard let conviva = self.retrieve(nativeId) else {
                throw Exception(
                    name: "ConvivaNotFound",
                    description: "Could not retrieve Conviva Analytics instance with native Id \(nativeId)"
                )
            }
            guard let metadataOverride = RCTConvert.metadataOverrides(metadata) else {
                throw Exception(
                    name: "InvalidMetadata",
                    description: "Could not convert metadata to MetadataOverrides"
                )
            }
            conviva.updateContentMetadata(metadataOverrides: metadataOverride)
        }
        .runOnQueue(.main)

        AsyncFunction("sendCustomApplicationEvent") { (nativeId: NativeId, name: String, attributes: [String: Any]) in
            guard let conviva = self.retrieve(nativeId) else {
                throw Exception(
                    name: "ConvivaNotFound",
                    description: "Could not retrieve Conviva Analytics instance with native Id \(nativeId)"
                )
            }
            let attributesStringDict = attributes.compactMapValues { $0 as? String }
            conviva.sendCustomApplicationEvent(name: name, attributes: attributesStringDict)
        }
        .runOnQueue(.main)

        AsyncFunction("sendCustomPlaybackEvent") { (nativeId: NativeId, name: String, attributes: [String: Any]) in
            guard let conviva = self.retrieve(nativeId) else {
                throw Exception(
                    name: "ConvivaNotFound",
                    description: "Could not retrieve Conviva Analytics instance with native Id \(nativeId)"
                )
            }
            let attributesStringDict = attributes.compactMapValues { $0 as? String }
            conviva.sendCustomPlaybackEvent(name: name, attributes: attributesStringDict)
        }
        .runOnQueue(.main)

        AsyncFunction("reportPlaybackDeficiency") { (nativeId: NativeId, message: String, severity: String, endSession: Bool) in // swiftlint:disable:this line_length
            guard let conviva = self.retrieve(nativeId) else {
                throw Exception(
                    name: "ConvivaNotFound",
                    description: "Could not retrieve Conviva Analytics instance with native Id \(nativeId)"
                )
            }
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

        AsyncFunction("pauseTracking") { (nativeId: NativeId, isBumper: Bool) in
            guard let conviva = self.retrieve(nativeId) else {
                throw Exception(
                    name: "ConvivaNotFound",
                    description: "Could not retrieve Conviva Analytics instance with native Id \(nativeId)"
                )
            }
            conviva.pauseTracking(isBumper: isBumper)
        }
        .runOnQueue(.main)

        AsyncFunction("resumeTracking") { (nativeId: NativeId) in
            guard let conviva = self.retrieve(nativeId) else {
                throw Exception(
                    name: "ConvivaNotFound",
                    description: "Could not retrieve Conviva Analytics instance with native Id \(nativeId)"
                )
            }
            conviva.resumeTracking()
        }
        .runOnQueue(.main)

        // iOS only functions
        AsyncFunction("setPlayerViewRef") { (nativeId: NativeId, playerViewRefId: Int) in
            guard let conviva = self.retrieve(nativeId) else {
                throw Exception(
                    name: "ConvivaNotFound",
                    description: "Could not retrieve Conviva Analytics instance with native Id \(nativeId)"
                )
            }

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

        AsyncFunction("resetPlayerViewRef") { (nativeId: NativeId) in
            guard let conviva = self.retrieve(nativeId) else {
                throw Exception(
                    name: "ConvivaNotFound",
                    description: "Could not retrieve Conviva Analytics instance with native Id \(nativeId)"
                )
            }
            conviva.playerView = nil
        }
        .runOnQueue(.main)

        // Android only functions (no-op on iOS)
        AsyncFunction("reportAppForegrounded") { (_: NativeId) in
            // No-op on iOS
        }
        .runOnQueue(.main)

        AsyncFunction("reportAppBackgrounded") { (_: NativeId) in
            // No-op on iOS
        }
        .runOnQueue(.main)
    }

    internal func retrieve(_ nativeId: NativeId) -> ConvivaAnalytics? {
        convivaAnalyticsInstances[nativeId]
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
