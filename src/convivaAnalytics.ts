import BitmovinPlayerReactNativeAnalyticsConvivaModule from './modules/BitmovinPlayerReactNativeAnalyticsConvivaModule';
import type { ConvivaMetadataOverrides } from './convivaMetadataOverrides';
import type { ConvivaErrorSeverity } from './convivaErrorSeverity';
import { Platform, findNodeHandle } from 'react-native';
import NativeInstance from './nativeInstance';
import type { ConvivaAnalyticsConfig } from './convivaAnalyticsConfig';
import { SsaiApi } from './ssaiApi';
import type { Player } from 'bitmovin-player-react-native';

/**
 * The ConvivaAnalytics class is used to interact with the Conviva Analytics SDK.
 * @platform Android, iOS, tvOS
 */
export class ConvivaAnalytics extends NativeInstance<ConvivaAnalyticsConfig> {
  isInitialized = false;
  isDestroyed = false;

  /**
   * Namespace for reporting server-side ad breaks and ads.
   * See {@link SsaiApi} for more information.
   */
  readonly ssai: SsaiApi = new SsaiApi(this.nativeId);

  /**
   * Initializes the conviva analytics.
   * @returns promise which resolves when the conviva analytics is sucessfully initialized.
   *
   * @platform Android, iOS, tvOS
   */
  initialize = async (): Promise<void> => {
    if (this.isInitialized) {
      return;
    }
    this.isInitialized = true;
    await this.config?.player?.initialize();
    return BitmovinPlayerReactNativeAnalyticsConvivaModule.initWithConfig(
      this.nativeId,
      this.config?.player?.nativeId ?? null,
      this.config?.customerKey ?? '',
      this.config?.gatewayUrl ?? null,
      this.config?.debugLoggingEnabled ?? false
    );
  };

  /**
   * Initializes a new conviva tracking session.
   *
   * @warning The integration can only be validated without external session managing. So when using this method we can
   * no longer ensure that the session is managed at the correct time. Additional: Since some metadata attributes
   * rely on the player's source we can't ensure that all metadata attributes are present at session creation.
   * Therefore it is possible that we receive a 'ContentMetadata created late' issue after conviva validation.
   *
   * If no source was loaded (or the itemTitle is missing) and no assetName was set via updateContentMetadata
   * this method will throw an error.
   *
   * @returns promise which resolves when the conviva tracking session is sucessfully initialized.
   *
   * @platform Android, iOS, tvOS
   */
  initializeSession = async (): Promise<void> => {
    return BitmovinPlayerReactNativeAnalyticsConvivaModule.initializeSession(
      this.nativeId
    );
  };

  /**
   * Attaches the given player to the conviva analytics.
   * This method should be called as soon as the `Player` instance is initialized to not miss any tracking.
   *
   * @warning Has no effect if there is already a {@link Player} instance set. Use the {@link ConvivaAnalyticsConfig} without `player` if you plan to attach a `Player` instance later in the life-cycle.
   *
   * @param player The player which should be attached to the conviva analytics.
   * @returns promise which resolves when the player is sucessfully attached to the conviva analytics.
   *
   * @platform Android, iOS, tvOS
   */
  attachPlayer = async (player: Player): Promise<void> => {
    return BitmovinPlayerReactNativeAnalyticsConvivaModule.attachPlayer(
      this.nativeId,
      player.nativeId
    );
  };

  /**
   * Destroys the native `ConvivaAnalytics` and releases all of its allocated resources.
   */
  destroy = () => {
    if (!this.isDestroyed) {
      BitmovinPlayerReactNativeAnalyticsConvivaModule.destroy(this.nativeId);
      this.isDestroyed = true;
    }
  };

  /**
   * Releases the conviva analytics.
   *
   * @platform Android, iOS, tvOS
   */
  release = () => {
    BitmovinPlayerReactNativeAnalyticsConvivaModule.release(this.nativeId);
  };

  /**
   * Ends the current conviva tracking session.
   * If there is no active session, the only thing that will happen is resetting the content metadata.
   *
   * @warning The integration can only be validated without external session managing.
   * So when using this method we can no longer ensure that the session is managed at the correct time.
   *
   * @platform Android, iOS, tvOS
   */
  endSession = () => {
    BitmovinPlayerReactNativeAnalyticsConvivaModule.endSession(this.nativeId);
  };

  /**
   * Set the `PlayerView.viewRef` to enable view triggered events like fullscreen state changes
   * @param viewRef reference to the `PlayerView` passed via `<PlayerView viewRef={viewRef}>`
   *
   * @platform iOS, tvOS
   */
  setPlayerViewRef = (viewRef: React.MutableRefObject<null> | undefined) => {
    if (Platform.OS !== 'ios') {
      console.warn(
        `[ConvivaAnalytics ${this.nativeId}] Method setPlayerViewRef is not available for Android. Only iOS and tvOS devices.`
      );
      return;
    }
    if (viewRef !== undefined && viewRef.current !== null) {
      const node = findNodeHandle(viewRef.current);
      if (node != null) {
        BitmovinPlayerReactNativeAnalyticsConvivaModule.setPlayerViewRef(
          this.nativeId,
          node
        );
      }
    } else {
      BitmovinPlayerReactNativeAnalyticsConvivaModule.resetPlayerViewRef(
        this.nativeId
      );
    }
  };

  /**
   * Will update the contentMetadata which are tracked with conviva.
   *
   * If there is an active session only permitted values will be updated and propagated immediately.
   *
   * If there is no active session the values will be set on session creation.
   *
   * Attributes set via this method will override automatic tracked ones.
   *
   * @param metadataOverrides MetadataOverrides attributes which will be used to track to conviva.
   * @see {@link ContentMetadataBuilder} for more information about permitted attributes
   *
   * @platform Android, iOS, tvOS
   */
  updateContentMetadata = (metadata: ConvivaMetadataOverrides) => {
    BitmovinPlayerReactNativeAnalyticsConvivaModule.updateContentMetadata(
      this.nativeId,
      metadata
    );
  };

  /**
   * Sends a custom application-level event to Conviva's Player Insight. An application-level event can always
   * be sent and is not tied to a specific video.
   *
   * @param name The name of the event
   * @param attributes A dictionary with custom event attributes
   *
   * @platform Android, iOS, tvOS
   */
  sendCustomApplicationEvent = (
    name: string,
    attributes: { [key: string]: string }
  ) => {
    BitmovinPlayerReactNativeAnalyticsConvivaModule.sendCustomApplicationEvent(
      this.nativeId,
      name,
      attributes
    );
  };

  /**
   * Sends a custom playback-level event to Conviva's Player Insight.
   * A playback-level event can only be sent during an active video session.
   *
   * @param name The name of the event
   * @param attributes A dictionary with custom event attributes
   *
   * @platform Android, iOS, tvOS
   */
  sendCustomPlaybackEvent = (
    name: string,
    attributes: { [key: string]: string }
  ) => {
    BitmovinPlayerReactNativeAnalyticsConvivaModule.sendCustomPlaybackEvent(
      this.nativeId,
      name,
      attributes
    );
  };

  /**
   * Sends a custom deficiency event during playback to Conviva's Player Insight. If no session is active it will NOT
   * create one.
   *
   * @param message    Message which will be send to conviva
   * @param severity   One of FATAL or WARNING
   * @param endSession Boolean flag if session should be closed after reporting the deficiency
   *
   * @platform Android, iOS, tvOS
   */
  reportPlaybackDeficiency = (
    message: string,
    severity: ConvivaErrorSeverity,
    endSession: boolean = true
  ) => {
    BitmovinPlayerReactNativeAnalyticsConvivaModule.reportPlaybackDeficiency(
      this.nativeId,
      message,
      severity,
      endSession
    );
  };

  /**
   * Puts the session state in a notMonitored state.
   *
   * @param isBumper If tracking is paused in order to display a bumper video (or similar), set this to true.
   *                 Otherwise the event is regarded as a "user wait"-event.
   *
   * @platform Android, iOS, tvOS
   */
  pauseTracking = (isBumper: boolean) => {
    BitmovinPlayerReactNativeAnalyticsConvivaModule.pauseTracking(
      this.nativeId,
      isBumper
    );
  };

  /**
   * Puts the session state from a notMonitored state into the last one tracked.
   * @platform Android, iOS, tvOS
   */
  resumeTracking = () => {
    BitmovinPlayerReactNativeAnalyticsConvivaModule.resumeTracking(
      this.nativeId
    );
  };

  /**
   * This should be called when the app is resumed.
   *
   * This is only available on Android and will have no effect on iOS and tvOS.
   *
   * @platform Android
   */
  reportAppForegrounded = () => {
    if (Platform.OS !== 'android') {
      console.warn(
        `[ConvivaAnalytics ${this.nativeId}] Method reportAppForegrounded is not available for iOS and tvOS. Only Android devices.`
      );
      return;
    }
    BitmovinPlayerReactNativeAnalyticsConvivaModule.reportAppForegrounded(
      this.nativeId
    );
  };

  /**
   * This should be called when the app is paused.
   *
   * This is only available on Android and will have no effect on iOS and tvOS.
   *
   * @platform Android
   */
  reportAppBackgrounded = () => {
    if (Platform.OS !== 'android') {
      console.warn(
        `[ConvivaAnalytics ${this.nativeId}] Method reportAppBackgrounded is not available for iOS and tvOS. Only Android devices.`
      );
      return;
    }
    BitmovinPlayerReactNativeAnalyticsConvivaModule.reportAppBackgrounded(
      this.nativeId
    );
  };
}
