import BitmovinConvivaAnalytics
import ExpoModulesCore
import Foundation
import RNBitmovinPlayer

internal final class SharedConviva: SharedObject {
    private var analytics: ConvivaAnalytics?
    private var player: SharedPlayer?

    init(analytics: ConvivaAnalytics, player: SharedPlayer?) {
        self.analytics = analytics
        self.player = player
        super.init()
    }

    deinit {
        let analytics = analytics
        let player = player
        DispatchQueue.main.async {
            withExtendedLifetime(player) { analytics?.release() }
        }
    }

    func requireAnalytics() throws -> ConvivaAnalytics {
        guard let analytics else {
            throw Exception(name: "ConvivaReleased", description: "Conviva Analytics has been released")
        }
        return analytics
    }

    func attach(_ player: SharedPlayer) throws -> Bool {
        let analytics = try requireAnalytics()
        guard self.player == nil else { return false }
        analytics.attach(player: player.player)
        self.player = player
        return true
    }

    func release() {
        analytics?.release()
        analytics = nil
        player = nil
    }
}
