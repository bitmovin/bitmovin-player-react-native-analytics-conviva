import { ConfigPlugin } from 'expo/config-plugins';
import { withConvivaAnalyticsIOS } from './withConvivaAnalyticsIOS';
import { BitmovinConvivaAnalyticsPluginProps } from './types';

/**
 * Expo Config Plugin for BitmovinConvivaAnalytics
 *
 * Automatically configures iOS BitmovinConvivaAnalytics pod dependency with version validation.
 * Android dependencies are handled via gradle and don't require plugin configuration.
 *
 * @param config - The Expo config object
 * @param props - Plugin configuration options
 * @returns Modified Expo config with iOS pod configuration
 *
 * @example
 * // app.config.js
 * module.exports = {
 *   plugins: [
 *     'bitmovin-player-react-native-analytics-conviva'
 *   ]
 * };
 *
 * @example
 * // app.config.js
 * module.exports = {
 *   plugins: [
 *     [
 *       'bitmovin-player-react-native-analytics-conviva',
 *       {
 *         bitmovinConvivaIosVersion: '3.6.1'
 *       }
 *     ]
 *   ]
 * };
 */
export const withBitmovinConvivaAnalytics: ConfigPlugin<
  BitmovinConvivaAnalyticsPluginProps
> = (config, props = {}) => {
  const { bitmovinConvivaIosVersion = '3.6.1' } = props;

  // Apply iOS modifications
  config = withConvivaAnalyticsIOS(config, {
    version: bitmovinConvivaIosVersion,
  });

  return config;
};
