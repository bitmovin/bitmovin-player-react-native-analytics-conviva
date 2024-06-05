@objc(BitmovinPlayerReactNativeAnalyticsConviva)
public class BitmovinPlayerReactNativeAnalyticsConviva: NSObject { // swiftlint:disable:this type_name
  @objc(message:resolver:rejecter:)
  func message(prefix: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    resolve("\(prefix) on iOS/tvOS!")
  }
}
