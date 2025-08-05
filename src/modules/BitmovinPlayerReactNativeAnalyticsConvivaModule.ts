import { requireNativeModule } from 'expo-modules-core';

interface BitmovinPlayerReactNativeAnalyticsConvivaModule {
  initWithConfig(
    nativeId: string,
    playerNativeId: string | null,
    customerKey: string,
    gatewayUrl: string | null,
    debugLoggingEnabled: boolean
  ): Promise<void>;
  attachPlayer(nativeId: string, playerNativeId: string): Promise<void>;
  destroy(nativeId: string): Promise<void>;
  release(nativeId: string): Promise<void>;
  initializeSession(nativeId: string): Promise<void>;
  endSession(nativeId: string): Promise<void>;
  updateContentMetadata(
    nativeId: string,
    metadata: Record<string, any>
  ): Promise<void>;
  sendCustomApplicationEvent(
    nativeId: string,
    name: string,
    attributes: Record<string, any>
  ): Promise<void>;
  sendCustomPlaybackEvent(
    nativeId: string,
    name: string,
    attributes: Record<string, any>
  ): Promise<void>;
  reportPlaybackDeficiency(
    nativeId: string,
    message: string,
    severity: string,
    endSession: boolean
  ): Promise<void>;
  pauseTracking(nativeId: string, isBumper: boolean): Promise<void>;
  resumeTracking(nativeId: string): Promise<void>;
  // Android only
  reportAppForegrounded(nativeId: string): Promise<void>;
  reportAppBackgrounded(nativeId: string): Promise<void>;
  // iOS only
  setPlayerViewRef(nativeId: string, playerViewRefId: number): Promise<void>;
  resetPlayerViewRef(nativeId: string): Promise<void>;
}

export default requireNativeModule<BitmovinPlayerReactNativeAnalyticsConvivaModule>(
  'BitmovinPlayerReactNativeAnalyticsConviva'
);
