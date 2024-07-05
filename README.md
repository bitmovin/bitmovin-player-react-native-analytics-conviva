# Bitmovin Player Conviva Analytics Integration

This is an open-source project to enable the use of a third-party component (Conviva) with the Bitmovin Player React Native SDK.

## Maintenance and Update

This project is not part of a regular maintenance or update schedule and is updated once yearly to conform with the latest product versions. For additional update requests, please take a look at the guidance further below.

## Contributions to this project

As an open-source project, we are pleased to accept any and all changes, updates and fixes from the community wishing to use this project. Please see [CONTRIBUTING.md](CONTRIBUTING.md) for more details on how to contribute.

## Reporting player bugs

If you come across a bug related to the player, please raise this through your support ticketing system.

## Need more help?

Should you want some help updating this project (update, modify, fix or otherwise) and cant contribute for any reason, please raise your request to your bitmovin account team, who can discuss your request.

## Support and SLA Disclaimer

As an open-source project and not a core product offering, any request, issue or query related to this project is excluded from any SLA and Support terms that a customer might have with either Bitmovin or another third-party service provider or Company contributing to this project. Any and all updates are purely at the contributor's discretion.

Thank you for your contributions!

## Installation

> To see how to use the example application, please refer to the [example README](example/README.md).

`bitmovin-player-react-native-analytics-conviva` is available through [NPM](https://www.npmjs.com/package/bitmovin-player-react-native-analytics-conviva).

To install it in your project, simply run:

```sh
npm install bitmovin-player-react-native-analytics-conviva
```

or with yarn:

```sh
yarn add bitmovin-player-react-native-analytics-conviva
```

Additionally to install the native dependencies, follow the next steps:

### iOS

Simply add the following lines to the top of your Podfile:

```ruby
source 'https://cdn.cocoapods.org'
source 'https://github.com/bitmovin/cocoapod-specs.git'
```

The the following line to your desired target:

```ruby
pod 'BitmovinConvivaAnalytics', git: 'https://github.com/bitmovin/bitmovin-player-ios-analytics-conviva.git', tag: '3.1.0'
```

Then, in your command line run in your `ios` folder:

```sh
pod repo update
pod install
```

### Android

Add the following to your `android/build.gradle`:

```gradle
allprojects {
  repositories {
    ...
    maven { url 'https://artifacts.bitmovin.com/artifactory/public-releases' }
  }
}
```

Add the following permissions to `AndroidManifest.xml`:

```
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
```

For more information about permissions and collected network types please look at the [Conviva Documentation](https://community.conviva.com/site/global/platforms/android/android_sdk/taskref/index.gsp#report_network_metrics).

### Compatibility

Conviva Analytics Integration depends on `bitmovin-player-react-native` version `>= 0.25.0`.

## Usage

### Basic Setup

The following example shows how to setup the Conviva Analytics integration with the Bitmovin Player React Native SDK:

```ts
const player = usePlayer();

const convivaAnalytics = useConvivaAnalytics({
  player: player,
  customerKey: 'YOUR-CONVIVA-CUSTOMER-KEY',
});

const onConvivaSetupError = useCallback((error) => {
  console.error('Conviva error', error);
}, []);

// Initialize ConvivaAnalytics
convivaAnalytics.initialize().catch(onConvivaSetupError);
```

### Cleanup

At the end of the application's lifecycle, release the integration with:

```ts
convivaAnalytics.release();
```

Details about usage of `BitmovinPlayer` can be found [here](https://github.com/bitmovin/bitmovin-player-ios-sdk-cocoapod).

### Content Metadata handling

If you want to override some content metadata attributes you can do so by adding the following:

```ts
const metadata: ConvivaMetadataOverrides = {
  applicationName: 'Bitmovin iOS Conviva integration example app',
  viewerId: 'awesomeViewerId',
  custom: { custom_tag: 'Episode' },
};
// …
// Initialize ConvivaAnalytics
// …

convivaAnalytics.updateContentMetadata(metadata);
```

Those values will be cleaned up after the session is closed.

### Server Side Ad Tracking

In order to track server side ads you can use the methods provided in `SsaiApi` which can be accessed via `ConvivaAnalytics.ssai`.
The following example shows basic server side ad tracking:

```swift
convivaAnalytics.ssai.reportAdBreakStarted()

const adInfo: SsaiAdInfo = {
    title: "My ad title",
    position: SsaiAdPosition.PREROLL,
    duration: 30,
}
convivaAnalytics.ssai.reportAdStarted(adInfo)

...

convivaAnalytics.ssai.reportAdFinished()
convivaAnalytics.ssai.reportAdBreakFinished()
```

In addition to the metadata provided in the `SsaiAdInfo` object at ad start, the following metadata will be auto collected from the main content metadata:

- Stream URL
- Asset Name
- Is live flag
- Defautl resource
- encoded frame rate
- streamType
- integrationVersion
- viewer ID
- player name

Metadata in the `SsaiAdInfo` overwrites all auto collected metadata.

### Background handling

If your app stops playback when entering background Conviva suggests to end the active session.
Since the integration can't know if you app supports playback in background this can't be done automatically.

To end a session use:

```ts
convivaAnalytics.endSession();
```

Since the `BitmovinPlayer` automatically pauses the video if no background playback is supported the session creation after
the app is in foreground again is handled automatically.

### UI events (iOS and tvOS only)

If you want to track UI related events such as full-screen state changes add the following after initializing the `PlayerView` with a `viewRef` parameter like:

```tsx
const playerViewRef = useRef(null);
const player = usePlayer();

useEffect(() => {
  convivaAnalytics.setPlayerViewRef(playerViewRef);
}, [convivaAnalytics]);

<PlayerView viewRef={playerViewRef} player={player} />;
```

### Consecutive playback

If you want to use the same player instance for multiple playback, just load a new source with `player.load(…)`. The integration will close the active session.

```ts
player.load(…);
```
