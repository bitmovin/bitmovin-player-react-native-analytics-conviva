import { type ConfigPlugin, withPodfileProperties } from 'expo/config-plugins';

export const withConvivaAnalyticsIOS: ConfigPlugin<{
  version?: string;
  revision?: string;
}> = (config, { version, revision }) =>
  withPodfileProperties(config, (config) => {
    delete config.modResults.BITMOVIN_CONVIVA_IOS_VERSION;
    delete config.modResults.BITMOVIN_CONVIVA_IOS_REVISION;
    if (version) config.modResults.BITMOVIN_CONVIVA_IOS_VERSION = version;
    if (revision) config.modResults.BITMOVIN_CONVIVA_IOS_REVISION = revision;
    return config;
  });
