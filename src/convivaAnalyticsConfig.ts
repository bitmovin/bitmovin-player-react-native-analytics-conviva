import type { Player } from 'bitmovin-player-react-native';
import type { NativeInstanceConfig } from './nativeInstance';

/**
 * Configuration options for the Conviva SDK Integration.
 */
export interface ConvivaAnalyticsConfig extends NativeInstanceConfig {
  /**
   * The player instance which will be used for tracking.
   * When not set at initialization, {@link ConvivaAnalytics.initializeSession} must be called after creating the {@link ConvivaAnalytics} instance.
   * The player instance can be set later via the {@link ConvivaAnalytics.attachPlayer} method.
   */
  player?: Player;
  /**
   * The customer key which will be used for tracking.
   */
  customerKey: string;
  /**
   * The `TOUCHSTONE_SERVICE_URL` for testing with Touchstone. Only to be used for development,
   * **must not be set in production or automated testing**.
   */
  gatewayUrl?: string;
  /**
   * Enables debug logging when set to true
   */
  debugLoggingEnabled?: boolean;
}
