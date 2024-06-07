#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_REMAP_MODULE(BitmovinPlayerReactNativeAnalyticsConviva, BitmovinPlayerReactNativeAnalyticsConviva, NSObject)
RCT_EXTERN_METHOD(initWithConfig:(NSString *)nativeId
                  playerNativeId:(NSString *)playerNativeId
                     customerKey:(NSString *)customerKey
                      gatewayUrl:(nullable NSString *)gatewayUrl
             debugLoggingEnabled:(BOOL)debugLoggingEnabled
                        resolver:(RCTPromiseResolveBlock)resolve
                        rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(destroy:(NSString *)nativeId)
RCT_EXTERN_METHOD(release:(NSString *)nativeId)
RCT_EXTERN_METHOD(endSession:(NSString *)nativeId)
RCT_EXTERN_METHOD(setPlayerViewRef:(NSString *)nativeId playerViewRefId:(nonnull NSNumber *)playerViewRefId)
RCT_EXTERN_METHOD(resetPlayerViewRef:(NSString *)nativeId)
RCT_EXTERN_METHOD(updateContentMetadata:(NSString *)nativeId metadata:(NSDictionary *)metadata)
RCT_EXTERN_METHOD(sendCustomApplicationEvent:(NSString *)nativeId
                                        name:(NSString *)name
                                  attributes:(NSDictionary *)metadata)
RCT_EXTERN_METHOD(sendCustomPlaybackEvent:(NSString *)nativeId
                                     name:(NSString *)name
                               attributes:(NSDictionary *)metadata)
RCT_EXTERN_METHOD(reportPlaybackDeficiency:(NSString *)nativeId
                                   message:(NSString *)message
                                  severity:(NSString *)severity
                                endSession:(BOOL)endSession)
RCT_EXTERN_METHOD(pauseTracking:(NSString *)nativeId
                       isBumper:(BOOL)isBumper)
RCT_EXTERN_METHOD(resumeTracking:(NSString *)nativeId)

@end
