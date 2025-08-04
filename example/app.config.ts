import type { ExpoConfig } from '@expo/config-types';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  throw new Error(
    `Environment file not found at "example/.env". Please copy "example/.env.example" to "example/.env" and fill it out.`
  );
}

// Load environment variables from .env file
dotenv.config({ path: envPath });

const {
  BITMOVIN_PLAYER_LICENSE_KEY,
  APPLE_DEVELOPMENT_TEAM_ID,
  EXPO_PUBLIC_CONVIVA_CUSTOMER_KEY,
  EXPO_PUBLIC_CONVIVA_GATEWAY_URL,
} = process.env;

if (!BITMOVIN_PLAYER_LICENSE_KEY) {
  throw new Error(
    'BITMOVIN_PLAYER_LICENSE_KEY is not set in example/.env. Please follow the setup instructions in example/README.md.'
  );
}

if (!EXPO_PUBLIC_CONVIVA_CUSTOMER_KEY) {
  throw new Error(
    'EXPO_PUBLIC_CONVIVA_CUSTOMER_KEY is not set in example/.env. Please follow the setup instructions in example/README.md.'
  );
}

if (!EXPO_PUBLIC_CONVIVA_GATEWAY_URL) {
  console.warn(
    'EXPO_PUBLIC_CONVIVA_GATEWAY_URL is not set in example/.env. Using default Conviva gateway URL. For testing with Touchstone, you need to set this to the appropriate URL.'
  );
}

if (!APPLE_DEVELOPMENT_TEAM_ID) {
  console.warn(
    'APPLE_DEVELOPMENT_TEAM_ID is not set in example/.env. This is required for running on real iOS/tvOS devices. Please follow the setup instructions in example/README.md.'
  );
}

const config: ExpoConfig = {
  name: 'Bitmovin Player React Native Analytics Conviva Example',
  slug: 'bitmovin-player-react-native-analytics-conviva-example',
  version: '0.0.1',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#1EABE3',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier:
      'com.bitmovin.player.reactnative.analytics.conviva.example',
    ...(APPLE_DEVELOPMENT_TEAM_ID && {
      appleTeamId: APPLE_DEVELOPMENT_TEAM_ID,
    }),
    infoPlist: {
      NSUserTrackingUsageDescription: 'User Tracking',
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: true,
        NSAllowsLocalNetworking: true,
      },
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#1EABE3',
    },
    package: 'com.bitmovin.player.reactnative.analytics.conviva.example',
  },
  plugins: [
    [
      '@react-native-tvos/config-tv',
      {
        androidTVBanner: './assets/android-tv-banner.png',
        appleTVImages: {
          icon: './assets/tvos-1280x768.png',
          iconSmall: './assets/icon-tvos.png',
          iconSmall2x: './assets/icon-tvos@2x.png',
          topShelf: './assets/TopShelf.png',
          topShelf2x: './assets/TopShelf@2x.png',
          topShelfWide: './assets/TopShelfWide.png',
          topShelfWide2x: './assets/TopShelfWide@2x.png',
        },
      },
    ],
    [
      'expo-build-properties',
      {
        android: { buildToolsVersion: '35.0.0' },
        ios: {
          flipper: false,
        },
      },
    ],
    [
      'bitmovin-player-react-native',
      {
        playerLicenseKey: BITMOVIN_PLAYER_LICENSE_KEY,
      },
    ],
    ['../app.plugin.js', { bitmovinConvivaIosVersion: '3.6.1' }],
  ],
};

export default config;
