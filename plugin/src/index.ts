import { createRunOncePlugin } from 'expo/config-plugins';
import { withBitmovinConvivaAnalytics } from './withBitmovinConvivaAnalytics';

// Keeping the name and version in sync with its package
const pkg = require('../../package.json');

/**
 * Export as run-once plugin to prevent duplicate applications.
 *
 * This ensures the plugin is only applied once even if it appears multiple times
 * in the plugins array or is included indirectly by other plugins.
 *
 * The plugin is uniquely identified by the package name and version.
 */
export default createRunOncePlugin(
  withBitmovinConvivaAnalytics,
  pkg.name,
  pkg.version
);

// Export types for consumers
export type { BitmovinConvivaAnalyticsPluginProps } from './types';
