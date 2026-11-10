import type { NativeConviva } from './BitmovinPlayerReactNativeAnalyticsConvivaModule';
import { type NativeModule, requireNativeModule } from 'expo-modules-core';

declare class BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule extends NativeModule {
  isAdBreakActive(owner: NativeConviva): Promise<boolean>;
  reportAdBreakStarted(
    owner: NativeConviva,
    adBreakInfo?: Record<string, any>
  ): Promise<void>;
  reportAdBreakFinished(owner: NativeConviva): Promise<void>;
  reportAdStarted(
    owner: NativeConviva,
    adInfo: Record<string, any>
  ): Promise<void>;
  reportAdFinished(owner: NativeConviva): Promise<void>;
  reportAdSkipped(owner: NativeConviva): Promise<void>;
  updateAdInfo(
    owner: NativeConviva,
    adInfo: Record<string, any>
  ): Promise<void>;
}

export default requireNativeModule<BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule>(
  'BitmovinPlayerReactNativeAnalyticsConvivaSsai'
);
