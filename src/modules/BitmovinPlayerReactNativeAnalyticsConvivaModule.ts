import { type NativeModule, requireNativeModule } from 'expo-modules-core';
import type { SharedObject } from 'expo-modules-core/types';
import type { Player } from 'bitmovin-player-react-native';

/** @internal */
export interface NativeConviva extends SharedObject {
  // Keep the JS player peer and its callback-owning sources reachable while attached.
  player?: Awaited<Player['native']>;
}

declare class BitmovinPlayerReactNativeAnalyticsConvivaModule extends NativeModule {
  create(
    player: Awaited<Player['native']> | null,
    customerKey: string,
    gatewayUrl: string | null,
    debugLoggingEnabled: boolean
  ): Promise<NativeConviva>;
  attachPlayer(
    owner: NativeConviva,
    player: Awaited<Player['native']>
  ): Promise<boolean>;
  destroy(owner: NativeConviva): Promise<void>;
  release(owner: NativeConviva): Promise<void>;
  initializeSession(owner: NativeConviva): Promise<void>;
  endSession(owner: NativeConviva): Promise<void>;
  updateContentMetadata(
    owner: NativeConviva,
    metadata: Record<string, any>
  ): Promise<void>;
  sendCustomApplicationEvent(
    owner: NativeConviva,
    name: string,
    attributes: Record<string, any>
  ): Promise<void>;
  sendCustomPlaybackEvent(
    owner: NativeConviva,
    name: string,
    attributes: Record<string, any>
  ): Promise<void>;
  reportPlaybackDeficiency(
    owner: NativeConviva,
    message: string,
    severity: string,
    endSession: boolean
  ): Promise<void>;
  pauseTracking(owner: NativeConviva, isBumper: boolean): Promise<void>;
  resumeTracking(owner: NativeConviva): Promise<void>;
  // Android only
  reportAppForegrounded(owner: NativeConviva): Promise<void>;
  reportAppBackgrounded(owner: NativeConviva): Promise<void>;
  // iOS only
  setPlayerViewRef(
    owner: NativeConviva,
    playerViewRefId: number
  ): Promise<void>;
  resetPlayerViewRef(owner: NativeConviva): Promise<void>;
}

export default requireNativeModule<BitmovinPlayerReactNativeAnalyticsConvivaModule>(
  'BitmovinPlayerReactNativeAnalyticsConviva'
);
