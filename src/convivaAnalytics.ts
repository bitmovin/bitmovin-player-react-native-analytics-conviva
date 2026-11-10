import BitmovinPlayerReactNativeAnalyticsConvivaModule, {
  type NativeConviva,
} from './modules/BitmovinPlayerReactNativeAnalyticsConvivaModule';
import type { ConvivaMetadataOverrides } from './convivaMetadataOverrides';
import type { ConvivaErrorSeverity } from './convivaErrorSeverity';
import { Platform, findNodeHandle } from 'react-native';
import NativeInstance from './nativeInstance';
import type { ConvivaAnalyticsConfig } from './convivaAnalyticsConfig';
import { SsaiApi } from './ssaiApi';
import type { Player } from 'bitmovin-player-react-native';
import { legacyConvivaRegistry } from './nativeInstanceRegistry';

/**
 * The ConvivaAnalytics class is used to interact with the Conviva Analytics SDK.
 */
export class ConvivaAnalytics extends NativeInstance<ConvivaAnalyticsConfig> {
  isInitialized = false;
  isDestroyed = false;

  /**
   * Namespace for reporting server-side ad breaks and ads.
   * See {@link SsaiApi} for more information.
   */
  readonly ssai: SsaiApi;

  /** @internal */
  readonly native: Promise<NativeConviva>;

  constructor(config?: ConvivaAnalyticsConfig) {
    super(config);
    this.native = legacyConvivaRegistry.create(this.nativeId, () =>
      this.createNative()
    );
    this.ssai = new SsaiApi(this.native);
    void this.initialize().catch(() => {});
  }

  private async createNative(): Promise<NativeConviva> {
    const player = this.config?.player
      ? await this.requireNativePlayer(this.config.player)
      : undefined;
    const owner = await BitmovinPlayerReactNativeAnalyticsConvivaModule.create(
      player ?? null,
      this.config?.customerKey ?? '',
      this.config?.gatewayUrl ?? null,
      this.config?.debugLoggingEnabled ?? false
    );
    owner.player = player;
    return owner;
  }

  private requireNativePlayer(player: Player): Player['native'] {
    if (!player.native) {
      throw new Error(
        'Conviva Analytics requires the SharedObject-based Player bindings.'
      );
    }
    return player.native;
  }

  /**
   * Initializes the conviva analytics.
   * @returns promise which resolves when the conviva analytics is sucessfully initialized.
   */
  initialize = async (): Promise<void> => {
    await this.native;
    this.isInitialized = true;
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
   */
  initializeSession = async (): Promise<void> => {
    return BitmovinPlayerReactNativeAnalyticsConvivaModule.initializeSession(
      await this.native
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
   */
  attachPlayer = async (player: Player): Promise<void> => {
    const [owner, nativePlayer] = await Promise.all([
      this.native,
      this.requireNativePlayer(player),
    ]);
    if (
      await BitmovinPlayerReactNativeAnalyticsConvivaModule.attachPlayer(
        owner,
        nativePlayer
      )
    ) {
      owner.player = nativePlayer;
    }
  };

  /**
   * Destroys the native `ConvivaAnalytics` and releases all of its allocated resources.
   */
  destroy = (): Promise<void> => this.release();

  /**
   * Releases the Conviva integration. Create a new instance to start tracking again.
   */
  release = async (): Promise<void> => {
    this.isDestroyed = true;
    legacyConvivaRegistry.remove(this.nativeId, this.native);
    const owner = await this.native;
    await BitmovinPlayerReactNativeAnalyticsConvivaModule.release(owner);
    owner.player = undefined;
  };

  /**
   * Ends the current conviva tracking session.
   * If there is no active session, the only thing that will happen is resetting the content metadata.
   *
   * @warning The integration can only be validated without external session managing.
   * So when using this method we can no longer ensure that the session is managed at the correct time.
   */
  endSession = async () => {
    return BitmovinPlayerReactNativeAnalyticsConvivaModule.endSession(
      await this.native
    );
  };

  /**
   * Set the `PlayerView.viewRef` to enable view triggered events like fullscreen state changes
   * @param viewRef reference to the `PlayerView` passed via `<PlayerView viewRef={viewRef}>`
   *
   * @platform iOS/tvOS
   */
  setPlayerViewRef = async (
    viewRef: React.MutableRefObject<null> | undefined
  ) => {
    if (Platform.OS !== 'ios') {
      console.warn(
        `[ConvivaAnalytics ${this.nativeId}] Method setPlayerViewRef is not available for Android. Only iOS and tvOS devices.`
      );
      return;
    }
    if (viewRef !== undefined && viewRef.current !== null) {
      const node = findNodeHandle(viewRef.current);
      if (node != null) {
        return BitmovinPlayerReactNativeAnalyticsConvivaModule.setPlayerViewRef(
          await this.native,
          node
        );
      }
    } else {
      return BitmovinPlayerReactNativeAnalyticsConvivaModule.resetPlayerViewRef(
        await this.native
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
   */
  updateContentMetadata = async (metadata: ConvivaMetadataOverrides) => {
    return BitmovinPlayerReactNativeAnalyticsConvivaModule.updateContentMetadata(
      await this.native,
      metadata
    );
  };

  /**
   * Sends a custom application-level event to Conviva's Player Insight. An application-level event can always
   * be sent and is not tied to a specific video.
   *
   * @param name The name of the event
   * @param attributes A dictionary with custom event attributes
   */
  sendCustomApplicationEvent = async (
    name: string,
    attributes: { [key: string]: string }
  ) => {
    return BitmovinPlayerReactNativeAnalyticsConvivaModule.sendCustomApplicationEvent(
      await this.native,
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
   */
  sendCustomPlaybackEvent = async (
    name: string,
    attributes: { [key: string]: string }
  ) => {
    return BitmovinPlayerReactNativeAnalyticsConvivaModule.sendCustomPlaybackEvent(
      await this.native,
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
   */
  reportPlaybackDeficiency = async (
    message: string,
    severity: ConvivaErrorSeverity,
    endSession: boolean = true
  ) => {
    return BitmovinPlayerReactNativeAnalyticsConvivaModule.reportPlaybackDeficiency(
      await this.native,
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
   */
  pauseTracking = async (isBumper: boolean) => {
    return BitmovinPlayerReactNativeAnalyticsConvivaModule.pauseTracking(
      await this.native,
      isBumper
    );
  };

  /**
   * Puts the session state from a notMonitored state into the last one tracked.
   */
  resumeTracking = async () => {
    return BitmovinPlayerReactNativeAnalyticsConvivaModule.resumeTracking(
      await this.native
    );
  };

  /**
   * This should be called when the app is resumed.
   *
   * This is only available on Android and will have no effect on iOS and tvOS.
   *
   * @platform Android
   */
  reportAppForegrounded = async () => {
    if (Platform.OS !== 'android') {
      console.warn(
        `[ConvivaAnalytics ${this.nativeId}] Method reportAppForegrounded is not available for iOS and tvOS. Only Android devices.`
      );
      return;
    }
    return BitmovinPlayerReactNativeAnalyticsConvivaModule.reportAppForegrounded(
      await this.native
    );
  };

  /**
   * This should be called when the app is paused.
   *
   * This is only available on Android and will have no effect on iOS and tvOS.
   *
   * @platform Android
   */
  reportAppBackgrounded = async () => {
    if (Platform.OS !== 'android') {
      console.warn(
        `[ConvivaAnalytics ${this.nativeId}] Method reportAppBackgrounded is not available for iOS and tvOS. Only Android devices.`
      );
      return;
    }
    return BitmovinPlayerReactNativeAnalyticsConvivaModule.reportAppBackgrounded(
      await this.native
    );
  };
}
