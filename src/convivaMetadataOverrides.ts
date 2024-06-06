import type { StreamType } from './streamType';

export interface ConvivaMetadataOverrides {
  // Can only be set once
  assetName?: string;

  // Can only be set before playback started
  viewerId?: string;
  streamType?: StreamType;
  applicationName?: string;
  custom?: { [key: string]: any };
  duration?: number;

  /**
   * Standard Conviva tags that aren't covered by the other fields in this class.
   * List of tags can be found here:
   * [Pre-defined Video and Content Metadata](https://pulse.conviva.com/learning-center/content/sensor_developer_center/sensor_integration/ios/ios_stream_sensor.html#Predefined_video_meta)
   */
  additionalStandardTags?: { [key: string]: any };

  // Dynamic
  encodedFramerate?: number;
  defaultResource?: string;
  streamUrl?: string;
}
