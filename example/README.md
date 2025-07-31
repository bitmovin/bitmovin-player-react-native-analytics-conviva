# Example Application

This is a modern Expo application built to showcase the features of `bitmovin-player-react-native-analytics-conviva`. The example uses the new Expo modules architecture and is independent from workspace dependencies.

## Getting started

This example app is now completely independent and uses Expo autolinking to resolve the parent analytics package.

### Prerequisites

- Node.js >= 18
- Expo CLI: `npm install -g @expo/cli`
- iOS: Xcode and iOS Simulator
- Android: Android Studio and Android SDK
- For TV: Apple TV Simulator (included in Xcode) or Android TV emulator

### Environment Setup

1. Copy the `.env` file and configure your keys:

   ```sh
   # The .env file is already configured - update the values as needed:
   BITMOVIN_PLAYER_LICENSE_KEY="your-license-key"
   EXPO_PUBLIC_CONVIVA_CUSTOMER_KEY="your-conviva-customer-key"
   EXPO_PUBLIC_CONVIVA_GATEWAY_URL="your-conviva-gateway-url" # optional
   APPLE_DEVELOPMENT_TEAM_ID="your-team-id" # for device builds
   ```

2. Install dependencies:
   ```sh
   cd example
   yarn install
   ```

## Configuration

The app is configured through `app.config.ts` with support for:

- iOS, tvOS, Android, and Android TV platforms
- Environment variables for license keys and Conviva configuration
- Modern Expo modules architecture
- TV-specific configurations and entitlements

### Add the Package Name and Bundle Identifiers as an Allowed Domain

Add the following package names and bundle identifiers of the example applications ending as an allowed domain on [https://bitmovin.com/dashboard](https://bitmovin.com/dashboard), under `Player -> Licenses` and also under `Analytics -> Licenses`.

#### Android example application Package Name

```
com.bitmovin.player.reactnative.analytics.conviva.example
```

#### iOS example application Bundle Identifier

```
com.bitmovin.PlayerReactNativeAnalyticsConvivaExample
```

#### tvOS example application Bundle Identifier

```
com.bitmovin.PlayerReactNativeAnalyticsConvivaExample-tvOS
```

## Running the application

### Development Scripts

```sh
# Start Expo development server
yarn start

# Mobile platforms
yarn prebuild --clean       # Prebuild native mobile apps
yarn ios                    # Run on iOS simulator
yarn android               # Run on Android emulator

# TV platforms
yarn prebuild:tv --clean # Prebuild native TV apps
yarn ios:tv                 # Run on Apple TV simulator
yarn android:tv            # Run on Android TV emulator

# Web platform
yarn web                    # Run on web browser

# Generate native projects
yarn prebuild              # Generate iOS/Android projects
yarn prebuild --clean        # Clean and regenerate projects
```

### Platform-Specific Notes

**iOS/tvOS Development:**

- Requires Xcode 15+ and iOS/tvOS 15.1+ deployment target
- Uses `xcbeautify` for cleaner build output

**Android/Android TV Development:**

- Requires Android SDK 24+ (Android 7.0)
- TV variant builds with `tvDebug` configuration
- Supports Android TV leanback launcher

**Troubleshooting:**

- Run `yarn prebuild --clean` if you encounter native build issues
- Check `.env` file configuration for missing environment variables
- Ensure autolinking is working: parent package should be resolved automatically
