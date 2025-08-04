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

1. **Create a local environment file:**
   From the root of the repository, copy the example `.env` template:

   ```bash
   cp example/.env.example example/.env
   ```

2. **Add your credentials:**
   Open `example/.env` and replace the placeholder values.
   - The `BITMOVIN_PLAYER_LICENSE_KEY` is required.
   - The `EXPO_PUBLIC_CONVIVA_CUSTOMER_KEY` is required.
   - The `EXPO_PUBLIC_CONVIVA_GATEWAY_URL` is optional; for testing with Touchstone, you need to set this to the appropriate URL.
   - The `APPLE_DEVELOPMENT_TEAM_ID` is optional and only needed if you want to build the app on a physical iOS or tvOS device. You can find your Apple Team ID on the [Apple Developer website](https://developer.apple.com/account/) under "Membership details".

These values are loaded automatically by `example/app.config.ts` during the prebuild process and are not committed to version control. **This method is for internal development only.**

### Re-generate the native iOS and Android applications

When changing `example/.env` or `example/app.config.ts` you will need to re-generate the native iOS and Android applications to pick those changes up.

The example application uses Expo Continuous Native Generation ([CNG](https://docs.expo.dev/workflow/continuous-native-generation/)) and the native apps can be re-generated using `yarn example prebuild`.
See `yarn example prebuild -h` for all options.

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
com.bitmovin.player.reactnative.analytics.conviva.example
```

#### tvOS example application Bundle Identifier

```
com.bitmovin.player.reactnative.analytics.conviva.example
```

## Running the application

### Development Scripts

```sh
# Start Expo development server
yarn start

# Mobile platforms
yarn example prebuild --clean       # Prebuild native mobile apps
yarn example ios                    # Run on iOS simulator
yarn example android               # Run on Android emulator

# TV platforms
yarn example prebuild:tv --clean # Prebuild native TV apps
yarn example ios:tv                 # Run on Apple TV simulator
yarn example android:tv            # Run on Android TV emulator
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

- Run `yarn example prebuild --clean` if you encounter native build issues
- Check `example/.env` file configuration for missing environment variables
- Ensure autolinking is working: parent package should be resolved automatically
