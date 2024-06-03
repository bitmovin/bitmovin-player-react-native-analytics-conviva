#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BitmovinPlayerReactNativeAnalyticsConviva, NSObject)

RCT_EXTERN_METHOD(message:(NSString *)prefix
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
