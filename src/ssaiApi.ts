import type { NativeConviva } from './modules/BitmovinPlayerReactNativeAnalyticsConvivaModule';
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
 */
export class SsaiApi {
  /** @internal */
  constructor(private readonly native: Promise<NativeConviva>) {}

  /**
   * Reports if a server-side ad break is currently active.
   * @returns true if an ad break is currently active, false otherwise
   */
  isAdBreakActive = async (): Promise<boolean> => {
    return BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule.isAdBreakActive(
      await this.native
    );
  };

  /**
   * Reports the start of a server-side ad break. Must be called before the first ad starts.
   * Has no effect if a server-side ad break is already playing.
   * @param adBreakInfo Map containing metadata about the server-side ad break. Can be `undefined`.
   */
  reportAdBreakStarted = async (
    adBreakInfo: { [key: string]: any } | undefined = undefined
  ): Promise<void> => {
    return BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule.reportAdBreakStarted(
      await this.native,
      adBreakInfo
    );
  };

  /**
   * Reports the end of a server-side ad break. Must be called after the last ad has finished.
   * Has no effect if no server-side ad break is currently active.
   */
  reportAdBreakFinished = async (): Promise<void> => {
    return BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule.reportAdBreakFinished(
      await this.native
    );
  };

  /**
   * Reports the start of a server-side ad.
   *
   * Has to be called after calling the `reportAdBreakStarted()` method.
   *
   * @param adInfo {@link SsaiAdInfo} containing metadata about the server-side ad.
   */
  reportAdStarted = async (adInfo: SsaiAdInfo): Promise<void> => {
    return BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule.reportAdStarted(
      await this.native,
      adInfo
    );
  };

  /**
   * Reports the end of a server-side ad.
   * Has no effect if no server-side ad is currently playing.
   */
  reportAdFinished = async (): Promise<void> => {
    return BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule.reportAdFinished(
      await this.native
    );
  };

  /**
   * Reports that the current ad was skipped.
   * Has no effect if no server-side ad is playing.
   */
  reportAdSkipped = async (): Promise<void> => {
    return BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule.reportAdSkipped(
      await this.native
    );
  };

  /**
   * Updates the ad metadata during an active client-side or server-side ad.
   * Has no effect if no server-side ad is playing.
   *
   * @param adInfo Object containing metadata about the ad.
   */
  updateAdInfo = async (adInfo: SsaiAdInfo): Promise<void> => {
    return BitmovinPlayerReactNativeAnalyticsConvivaSsaiModule.updateAdInfo(
      await this.native,
      adInfo
    );
  };
}
