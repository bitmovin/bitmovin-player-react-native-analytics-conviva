import type { Player } from 'bitmovin-player-react-native';
import type { ConvivaConfig } from './convivaConfig';
import type { ConvivaMetadataOverrides } from './convivaMetadataOverrides';
import type { ConvivaErrorSeverity } from './convivaErrorSeverity';
import { Platform } from 'react-native';

/**
 * The ConvivaAnalytics class is used to interact with the Conviva Analytics SDK.
 * @platform Android, iOS, tvOS
 */
export class ConvivaAnalytics {
  player: Player;
  customerKey: string;
  config: ConvivaConfig;

  /**
   * Creates a new instance of the ConvivaAnalytics.
   *
   * @param player The player instance which will be used for tracking.
   * @param customerKey The customer key which will be used for tracking.
   * @param config The configuration for the conviva analytics.
   */
  constructor(
    player: Player,
    customerKey: string,
    config: ConvivaConfig | undefined = undefined
  ) {
    this.player = player;
    this.customerKey = customerKey;
    this.config = config || { debugLoggingEnabled: false };
  }

  /**
   * Initializes the conviva analytics.
   * @returns promise which resolves when the conviva analytics is sucessfully initialized.
   *
   * @platform Android, iOS, tvOS
   */
  initialize = async (): Promise<void> => {
    // TODO: Implement initialization
    console.log('ConvivaAnalytics initialized');
    return Promise.resolve();
  };

  /**
   * Releases the conviva analytics.
   *
   * @platform Android, iOS, tvOS
   */
  release = () => {
    // TODO: Implement release
    console.log('ConvivaAnalytics released');
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
    // TODO: Implement endSession
    console.log('ConvivaAnalytics session ended');
  };

  /**
   * Set the PlayerView to enable view triggered events like fullscreen state changes
   * @param viewRef reference to the PlayerView passed via `<PlayerView viewRef={viewRef}>`
   *
   * @platform Android, iOS, tvOS
   */
  setPlayerViewRef = (viewRef: React.MutableRefObject<null>) => {
    // TODO: Implement setPlayerViewRef
    console.log(`ConvivaAnalytics player view ref set to ${viewRef}`);
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
    // TODO: Implement updateContentMetadata
    console.log(
      `ConvivaAnalytics content metadata updated with ${JSON.stringify(metadata)}`
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
    attributes: { [key: string]: any }
  ) => {
    // TODO: Implement sendCustomApplicationEvent
    console.log(
      `ConvivaAnalytics custom application event sent with name ${name} and attributes ${JSON.stringify(attributes)}`
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
    attributes: { [key: string]: any }
  ) => {
    // TODO: Implement sendCustomPlaybackEvent
    console.log(
      `ConvivaAnalytics custom playback event sent with name ${name} and attributes ${JSON.stringify(attributes)}`
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
    // TODO: Implement reportPlaybackDeficiency
    console.log(
      `ConvivaAnalytics playback deficiency reported with message ${message}, severity ${severity}, and endSession ${endSession}`
    );
  };

  /**
   * Puts the session state in a notMonitored state.
   *
   * @param isBumper If tracking is paused in order to display a bumper video (or similar), set this to true.
   *                  Otherwise the event is regarded as a "user wait"-event.
   *
   * @platform Android, iOS, tvOS
   */
  pauseTracking = (isBumper: boolean) => {
    // TODO: Implement pauseTracking
    console.log(`ConvivaAnalytics tracking paused with bumper: ${isBumper}`);
  };

  /**
   * Puts the session state from a notMonitored state into the last one tracked.
   * @platform Android, iOS, tvOS
   */
  resumeTracking = () => {
    // TODO: Implement resumeTracking
    console.log('ConvivaAnalytics tracking resumed');
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
      return;
    }
    // TODO: Implement reportAppForegrounded
    console.log('ConvivaAnalytics app foregrounded');
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
      return;
    }
    // TODO: Implement reportAppBackgrounded
    console.log('ConvivaAnalytics app backgrounded');
  };
}
