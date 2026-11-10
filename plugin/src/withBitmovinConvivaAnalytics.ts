import type { ConfigPlugin } from 'expo/config-plugins';
import { withConvivaAnalyticsIOS } from './withConvivaAnalyticsIOS';
import type { BitmovinConvivaAnalyticsPluginProps } from './types';

/** Configure the native Conviva Swift package used alongside the Player package. */
export const withBitmovinConvivaAnalytics: ConfigPlugin<
  BitmovinConvivaAnalyticsPluginProps
> = (config, props = {}) => {
  const {
    bitmovinConvivaIosVersion: version,
    bitmovinConvivaIosRevision: revision,
  } = props;
  if (version && revision) {
    throw new Error(
      'Choose either bitmovinConvivaIosVersion or bitmovinConvivaIosRevision.'
    );
  }
  return withConvivaAnalyticsIOS(config, { version, revision });
};
