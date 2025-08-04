import BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule from './modules/BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule';

export enum SsaiAdPosition {
  PREROLL = 'preroll',
  MIDROLL = 'midroll',
  POSTROLL = 'postroll',
}

/**
 * Represents metadata for an ad.
 */
export interface SsaiAdInfo {
  title?: string;
  /**
   * Duration of the ad, in seconds.
   */
  duration?: number;
  /**
   * The ad ID extracted from the ad server that contains the ad creative.
   */
  id?: string;
  /**
   * The name of the ad system (i.e., the ad server).
   */
  adSystem?: string;
  /**
   * The position of the ad.
   * See {@link SsaiAdPosition} for possible values.
   */
  position?: SsaiAdPosition;
  /**
   * Indicates whether this ad is a slate or not. Set to `true` for slate and `false` for a regular ad.
   * Default is `false`.
   */
  isSlate?: boolean;
  /**
   * The name of the ad stitcher.
   */
  adStitcher?: string;
  /**
   * Additional ad metadata. This is a map of key-value pairs that can be used to pass additional metadata about the ad.
   * A list of ad metadata can be found here: [Conviva documentation](https://pulse.conviva.com/learning-center/content/sensor_developer_center/sensor_integration/javascript/javascript_stream_sensor.htm#IntegrateAdManagers)
   *
   * Metadata provided here will supersede any data provided in the ad break info.
   */
  additionalMetadata?: { [key: string]: any };
}

/**
 * Enables reporting of server-side ad breaks and ads.
 * @platform Android, iOS, tvOS
 */
export class SsaiApi {
  /**
   * The native conviva analytics id that this SSAI API is attached to.
   */
  readonly nativeId: string;

  constructor(nativeId: string) {
    this.nativeId = nativeId;
  }

  /**
   * Reports if a server-side ad break is currently active.
   * @returns true if an ad break is currently active, false otherwise
   *
   * @platform Android, iOS, tvOS
   */
  isAdBreakActive = async (): Promise<boolean> => {
    return BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule.isAdBreakActive(
      this.nativeId
    );
  };

  /**
   * Reports the start of a server-side ad break. Must be called before the first ad starts.
   * Has no effect if a server-side ad break is already playing.
   * @param adBreakInfo Map containing metadata about the server-side ad break. Can be `undefined`.
   *
   * @platform Android, iOS, tvOS
   */
  reportAdBreakStarted = async (
    adBreakInfo: { [key: string]: any } | undefined = undefined
  ): Promise<void> => {
    return BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule.reportAdBreakStarted(
      this.nativeId,
      adBreakInfo
    );
  };

  /**
   * Reports the end of a server-side ad break. Must be called after the last ad has finished.
   * Has no effect if no server-side ad break is currently active.
   *
   * @platform Android, iOS, tvOS
   */
  reportAdBreakFinished = async (): Promise<void> => {
    return BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule.reportAdBreakFinished(
      this.nativeId
    );
  };

  /**
   * Reports the start of a server-side ad.
   *
   * Has to be called after calling the `reportAdBreakStarted()` method.
   *
   * @param adInfo {@link SsaiAdInfo} containing metadata about the server-side ad.
   * @platform Android, iOS, tvOS
   */
  reportAdStarted = async (adInfo: SsaiAdInfo): Promise<void> => {
    return BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule.reportAdStarted(
      this.nativeId,
      adInfo
    );
  };

  /**
   * Reports the end of a server-side ad.
   * Has no effect if no server-side ad is currently playing.
   *
   * @platform Android, iOS, tvOS
   */
  reportAdFinished = async (): Promise<void> => {
    return BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule.reportAdFinished(
      this.nativeId
    );
  };

  /**
   * Reports that the current ad was skipped.
   * Has no effect if no server-side ad is playing.
   *
   * @platform Android, iOS, tvOS
   */
  reportAdSkipped = async (): Promise<void> => {
    return BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule.reportAdSkipped(
      this.nativeId
    );
  };

  /**
   * Updates the ad metadata during an active client-side or server-side ad.
   * Has no effect if no server-side ad is playing.
   *
   * @param adInfo Object containing metadata about the ad.
   * @platform Android, iOS, tvOS
   */
  updateAdInfo = async (adInfo: SsaiAdInfo): Promise<void> => {
    BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule.updateAdInfo(
      this.nativeId,
      adInfo
    );
  };
}
