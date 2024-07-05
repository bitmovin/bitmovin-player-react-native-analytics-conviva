import BitmovinConvivaAnalytics
import BitmovinPlayerCore
import ConvivaSDK
import React
import RNBitmovinPlayer

@objc(BitmovinPlayerReactNativeAnalyticsConviva)
public class BitmovinPlayerReactNativeAnalyticsConviva: NSObject, RCTBridgeModule { // swiftlint:disable:this type_name
    // swiftlint:disable:next implicitly_unwrapped_optional
    @objc public var bridge: RCTBridge!

    private var convivaAnalyticsInstances: Registry<ConvivaAnalytics> = [:]

    // swiftlint:disable:next implicitly_unwrapped_optional
    public static func moduleName() -> String! {
        "BitmovinPlayerReactNativeAnalyticsConviva"
    }

    public static func requiresMainQueueSetup() -> Bool {
        true
    }

    // swiftlint:disable:next implicitly_unwrapped_optional
    public var methodQueue: DispatchQueue! {
        bridge.uiManager.methodQueue
    }

    internal func retrieve(_ nativeId: NativeId) -> ConvivaAnalytics? {
        convivaAnalyticsInstances[nativeId]
    }

    @objc(initWithConfig:playerNativeId:customerKey:gatewayUrl:debugLoggingEnabled:resolver:rejecter:)
    func initWithConfig( // swiftlint:disable:this function_parameter_count
        _ nativeId: NativeId,
        playerNativeId: NativeId,
        customerKey: String,
        gatewayUrl: String?,
        debugLoggingEnabled: Bool,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        bridge.uiManager.addUIBlock { [weak self] _, _ in
            guard let self else { return }

            guard let player = self.retrievePlayer(nativeId: playerNativeId) else {
                reject(
                    Self.moduleName(),
                    "Could not retrieve Player with native Id \(playerNativeId)",
                    nil
                )
                return
            }
            do {
                let convivaConfig = ConvivaConfiguration()
                if let gatewayUrl {
                    if let gatewayUrlValue = RCTConvert.nsurl(gatewayUrl) {
                        convivaConfig.gatewayUrl = gatewayUrlValue
                    } else {
                        reject(
                            Self.moduleName(),
                            "Invalid gatewayUrl value \"\(gatewayUrl)\"",
                            nil
                        )
                        return
                    }
                }
                if debugLoggingEnabled {
                    convivaConfig.convivaLogLevel = .LOGLEVEL_DEBUG
                }
                convivaConfig.debugLoggingEnabled = debugLoggingEnabled
                let convivaAnalytics = try ConvivaAnalytics(
                    player: player,
                    customerKey: customerKey,
                    config: convivaConfig
                )
                convivaAnalyticsInstances[nativeId] = convivaAnalytics
                resolve(nil)
            } catch {
                reject(
                    Self.moduleName(),
                    "Could not initialize Conviva Analytics with native Id \(playerNativeId)",
                    error
                )
            }
        }
    }

    @objc(destroy:)
    func destroy(_ nativeId: NativeId) {
        bridge.uiManager.addUIBlock { [weak self] _, _ in
            guard let self else { return }
            self.convivaAnalyticsInstances[nativeId]?.release()
            self.convivaAnalyticsInstances.removeValue(forKey: nativeId)
        }
    }

    @objc(release:)
    func release(_ nativeId: NativeId) {
        bridge.uiManager.addUIBlock { [weak self] _, _ in
            guard let self,
                  let conviva = self.retrieve(nativeId) else { return }
            conviva.release()
        }
    }

    @objc(endSession:)
    func endSession(_ nativeId: NativeId) {
        bridge.uiManager.addUIBlock { [weak self] _, _ in
            guard let self,
                  let conviva = self.retrieve(nativeId) else { return }
            conviva.endSession()
        }
    }

    @objc(setPlayerViewRef:playerViewRefId:)
    func setPlayerViewRef(_ nativeId: NativeId, playerViewRefId: NSNumber) {
        bridge.uiManager.addUIBlock { [weak self] _, views in
            guard let self,
                  let conviva = self.retrieve(nativeId),
                  let wrapperView = views?[playerViewRefId] as? RNPlayerView,
                  let playerView = wrapperView.subviews.first(where: { $0 is PlayerView }) as? PlayerView else {
                return
            }

            conviva.playerView = playerView
        }
    }

    @objc(resetPlayerViewRef:)
    func resetPlayerViewRef(_ nativeId: NativeId) {
        bridge.uiManager.addUIBlock { [weak self] _, _ in
            guard let self,
                  let conviva = self.retrieve(nativeId) else { return }
            conviva.playerView = nil
        }
    }

    @objc(updateContentMetadata:metadata:)
    func updateContentMetadata(_ nativeId: NativeId, metadata: NSDictionary) {
        bridge.uiManager.addUIBlock { [weak self] _, _ in
            guard let self,
                  let conviva = self.retrieve(nativeId),
            let metadataOverride = RCTConvert.metadataOverrides(metadata) else { return }
            conviva.updateContentMetadata(metadataOverrides: metadataOverride)
        }
    }

    @objc(sendCustomApplicationEvent:name:attributes:)
    func sendCustomApplicationEvent(
        _ nativeId: NativeId,
        name: String,
        attributes: NSDictionary
    ) {
        bridge.uiManager.addUIBlock { [weak self] _, _ in
            guard let self,
                  let conviva = self.retrieve(nativeId),
                  let attributesAnyDict = attributes as? [String: Any] else { return }
            let attributesStringDict = attributesAnyDict.compactMapValues { $0 as? String }
            conviva.sendCustomApplicationEvent(name: name, attributes: attributesStringDict)
        }
    }

    @objc(sendCustomPlaybackEvent:name:attributes:)
    func sendCustomPlaybackEvent(
        _ nativeId: NativeId,
        name: String,
        attributes: NSDictionary
    ) {
        bridge.uiManager.addUIBlock { [weak self] _, _ in
            guard let self,
                  let conviva = self.retrieve(nativeId),
                  let attributesAnyDict = attributes as? [String: Any] else { return }
            let attributesStringDict = attributesAnyDict.compactMapValues { $0 as? String }
            conviva.sendCustomPlaybackEvent(name: name, attributes: attributesStringDict)
        }
    }

    @objc(reportPlaybackDeficiency:message:severity:endSession:)
    func reportPlaybackDeficiency(
        _ nativeId: NativeId,
        message: String,
        severity: String,
        endSession: Bool
    ) {
        bridge.uiManager.addUIBlock { [weak self] _, _ in
            guard let self,
                  let conviva = self.retrieve(nativeId),
                  let severityValue = RCTConvert.severity(severity) else { return }
            // Reset metadata to align behavior with Android
            conviva.updateContentMetadata(metadataOverrides: MetadataOverrides())
            conviva.reportPlaybackDeficiency(
                message: message,
                severity: severityValue,
                endSession: endSession
            )
        }
    }

    @objc(pauseTracking:isBumper:)
    func pauseTracking(_ nativeId: NativeId, isBumper: Bool) {
        bridge.uiManager.addUIBlock { [weak self] _, _ in
            guard let self,
                  let conviva = self.retrieve(nativeId) else { return }
            conviva.pauseTracking(isBumper: isBumper)
        }
    }

    @objc(resumeTracking:)
    func resumeTracking(_ nativeId: NativeId) {
        bridge.uiManager.addUIBlock { [weak self] _, _ in
            guard let self,
                  let conviva = self.retrieve(nativeId) else { return }
            conviva.resumeTracking()
        }
    }

    private func retrievePlayer(nativeId: String) -> Player? {
        guard let playerModule = self.bridge.module(for: PlayerModule.self) as? PlayerModule,
              playerModule.responds(to: #selector(PlayerModuleProtocol.retrieve(_:))) else {
            return nil
        }
        return playerModule.perform(#selector(PlayerModuleProtocol.retrieve(_:)), with: nativeId)
            .takeUnretainedValue() as? Player
    }
}

@objc
private protocol PlayerModuleProtocol {
    func retrieve(_ nativeId: String) -> Player?
}
