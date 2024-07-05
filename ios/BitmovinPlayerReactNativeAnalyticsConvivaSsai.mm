#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_REMAP_MODULE(BitmovinPlayerReactNativeAnalyticsConvivaSsai, BitmovinPlayerReactNativeAnalyticsConvivaSsai, NSObject)
RCT_EXTERN_METHOD(isAdbreakActive:(NSString *)nativeId
                         resolver:(RCTPromiseResolveBlock)resolve
                         rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(reportAdBreakStarted:(NSString *)nativeId
                           adBreakInfo:(nullable NSDictionary *)adBreakInfo
                              resolver:(RCTPromiseResolveBlock)resolve
                              rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(reportAdBreakFinished:(NSString *)nativeId
                               resolver:(RCTPromiseResolveBlock)resolve
                               rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(reportAdStarted:(NSString *)nativeId
                           adInfo:(nonnull NSDictionary *)adInfo
                         resolver:(RCTPromiseResolveBlock)resolve
                         rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(reportAdFinished:(NSString *)nativeId
                          resolver:(RCTPromiseResolveBlock)resolve
                          rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(reportAdSkipped:(NSString *)nativeId
                         resolver:(RCTPromiseResolveBlock)resolve
                         rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(updateAdInfo:(NSString *)nativeId
                        adInfo:(nonnull NSDictionary *)adInfo
                      resolver:(RCTPromiseResolveBlock)resolve
                      rejecter:(RCTPromiseRejectBlock)reject)
@end
