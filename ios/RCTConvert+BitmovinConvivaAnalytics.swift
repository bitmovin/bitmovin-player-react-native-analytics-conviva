import BitmovinConvivaAnalytics
import ConvivaSDK
import Foundation
import React

extension RCTConvert {
    static func severity(_ json: String) -> ErrorSeverity? {
        switch json {
        case "FATAL":
            return .ERROR_FATAL
        case "WARNING":
            return .ERROR_WARNING
        default:
            return nil
        }
    }

    static func metadataOverrides(_ json: NSDictionary) -> MetadataOverrides? {
        var metadataOverrides = MetadataOverrides()
        metadataOverrides.assetName = json["assetName"] as? String
        metadataOverrides.viewerId = json["viewerId"] as? String
        metadataOverrides.streamType = RCTConvert.streamType(json["streamType"] as? String)
        metadataOverrides.applicationName = json["applicationName"] as? String
        metadataOverrides.custom = json["custom"] as? [String: Any]
        metadataOverrides.duration = (json["duration"] as? NSNumber)?.intValue
        metadataOverrides.additionalStandardTags = json["additionalStandardTags"] as? [String: Any]
        metadataOverrides.encodedFramerate = (json["encodedFramerate"] as? NSNumber)?.intValue
        metadataOverrides.defaultResource = json["defaultResource"] as? String
        metadataOverrides.streamUrl = json["streamUrl"] as? String
        metadataOverrides.imaSdkVersion = json["imaSdkVersion"] as? String
        return metadataOverrides
    }

    static func streamType(_ json: String?) -> StreamType? {
        switch json {
        case "UNKNOWN":
            return .CONVIVA_STREAM_UNKNOWN
        case "LIVE":
            return .CONVIVA_STREAM_LIVE
        case "VOD":
            return .CONVIVA_STREAM_VOD
        default:
            return nil
        }
    }
}
