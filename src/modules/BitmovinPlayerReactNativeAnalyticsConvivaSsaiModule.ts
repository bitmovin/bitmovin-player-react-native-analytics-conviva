import { requireNativeModule } from 'expo-modules-core';

interface BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule {
  isAdBreakActive(nativeId: string): Promise<boolean>;
  reportAdBreakStarted(
    nativeId: string,
    adBreakInfo?: Record<string, any>
  ): Promise<void>;
  reportAdBreakFinished(nativeId: string): Promise<void>;
  reportAdStarted(nativeId: string, adInfo: Record<string, any>): Promise<void>;
  reportAdFinished(nativeId: string): Promise<void>;
  reportAdSkipped(nativeId: string): Promise<void>;
  updateAdInfo(nativeId: string, adInfo: Record<string, any>): Promise<void>;
}

export default requireNativeModule<BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule>(
  'BitmovinPlayerReactNativeAnalyticsConvivaSsai'
);
