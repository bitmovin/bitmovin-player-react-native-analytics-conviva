# Example Application

This is a React Native application built to showcase the features of `bitmovin-player-react-native-analytics-conviva`. The code for example usage of this library is contained inside the [`example/src/App.tsx`](https://github.com/bitmovin/bitmovin-player-react-native-analytics-conviva/tree/main/example/src/App.tsx) directory:

## Getting started

To get started with the project, run `yarn bootstrap` in the library's root directory (not `example/`). This will install dependencies for both the library and the example application (as well as native dependencies):

```sh
cd bitmovin-player-react-native-analytics-conviva # Go to library's root directory
yarn bootstrap # Install all dependencies
```

## Configuring your license key

Before running the application, make sure to set up your Bitmovin's license key in the native metadata file of each platform:

**iOS**

Edit the license key in `example/ios/BitmovinPlayerReactNativeAnalyticsConvivaExample/Info.plist`:

```xml
<key>BitmovinPlayerLicenseKey</key>
<string>ENTER_LICENSE_KEY</string>
```

**tvOS**

Edit the license key in `example/ios/BitmovinPlayerReactNativeAnalyticsConvivaExample-tvOS/Info.plist`:

```xml
<key>BitmovinPlayerLicenseKey</key>
<string>ENTER_LICENSE_KEY</string>
```

**Android**

Edit the license key in `example/android/app/src/main/AndroidManifest.xml`:

```xml
<meta-data android:name="BITMOVIN_PLAYER_LICENSE_KEY" android:value="<ENTER_LICENSE_KEY>" />
```

**Programmatically**

Alternatively you can provide your license key programmatically via the config object of `usePlayer`. Providing it this way removes the need for the step above, but keep in mind that at least one of them is necessary to successfully run the examples.

```ts
const player = usePlayer({
  // Just pass the key in the config object of `usePlayer` or `new Player()` in each example
  licenseKey: 'Your-License-Key',
});
```

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

**Terminal**

```sh
yarn example ios # Run examples on iOS
yarn example android # Run examples on Android
```

Hint: You can provide a specific simulator by name when using `--simulator` flag. `xcrun simctl list devices available` provides you with a list of available devices in your environment.

```sh
yarn example ios --simulator="iPhone 15 Pro"
```

**IDE**

You can also open the iOS project using Xcode by typing `xed example/ios` on terminal, or `studio example/android` to open the android project in Android Studio (make sure to setup its binaries first).

### Running the bundler only

The bundler is automatically started when running `yarn example android` or `yarn example ios` or when running via the IDEs, but it can also be started separately.

To start the metro bundler, run the following command on the library's root (always execute `yarn` from the library's root):

```sh
yarn example start # Starts bundler on the example folder
```
