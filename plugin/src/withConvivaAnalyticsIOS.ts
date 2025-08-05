import { ConfigPlugin } from 'expo/config-plugins';
import { withBuildProperties } from 'expo-build-properties';

export const withConvivaAnalyticsIOS: ConfigPlugin<{ version: string }> = (
  config,
  { version }
) =>
  withBuildProperties(config, {
    ios: {
      extraPods: [
        // Example: Git-based pod (tag/branch/commit allowed)
        {
          name: 'BitmovinConvivaAnalytics',
          git: 'https://github.com/bitmovin/bitmovin-player-ios-analytics-conviva.git',
          tag: version,
        },
      ],
    },
  });
