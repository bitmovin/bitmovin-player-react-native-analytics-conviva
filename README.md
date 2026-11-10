# Bitmovin Player Conviva Analytics Integration

This is an open-source project to enable the use of a third-party component (Conviva) with the Bitmovin Player React Native SDK.

> **Compatibility:** This version targets the upcoming React Native Player release
> containing [SharedObjects support (#1167)](https://github.com/bitmovin/bitmovin-player-react-native/pull/1167).
> It is incompatible with currently released Player versions (`1.30.0` and earlier).
> Until that release is available, use the pinned development revision. The exact
> minimum supported release version must be set before publishing this integration.

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

This branch requires the SharedObject-based Player bindings, Expo SDK 57+, and iOS/tvOS 16.4+.
The development dependencies and example pin the compatible unreleased Player revision.
The peer range excludes current releases; the future release must also contain #1167.

### iOS

The native Conviva integration is linked through Swift Package Manager, using the
same Player package as the React Native bindings. Remove any manually configured
`BitmovinConvivaAnalytics`, `BitmovinPlayer`, and `ConvivaSDK` pods before upgrading.

Add the config plugin after the Player plugin:

```javascript
export default {
  plugins: [
    'bitmovin-player-react-native',
    'bitmovin-player-react-native-analytics-conviva',
  ],
};
```

The native package defaults to the compatible revision in `ios/dependencies.json`.
This includes the deployment target fix needed by current Player packages. Run `yarn expo prebuild`
and install pods to regenerate the native integration. The React Native module
itself remains a local pod; its native SDK dependency comes from SPM.

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

This version requires the upcoming React Native Player release containing #1167 and Expo SDK 57+. Player `1.30.0` and earlier are incompatible. The pinned development dependency identifies the compatible unreleased revision.

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

```ts
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
- Default resource
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

### External VST tracking

If your app needs additional setup steps which should be included in VST tracking, such as DRM token generation, before the `Player` instance can be initialized,
the `ConvivaAnalytics` can be initialized without a `Player` instance. Once the `Player` instance is created it can be attached.

1. Create the `ConvivaAnalytics` instance with your `customerKey`.

```ts
const convivaAnalytics = useConvivaAnalytics({
  customerKey: 'YOUR-CONVIVA-CUSTOMER-KEY',
});

const onConvivaSetupError = useCallback((error) => {
  console.error('Conviva error', error);
}, []);

// Initialize ConvivaAnalytics
convivaAnalytics.initialize().catch(onConvivaSetupError);
```

2. Conviva requires that the `assetName` is set at session initialization. Therefore ensure that you provide using the `ConvivaAnalytics.updateContentMetadata()` **before** initializing the tracking session.

```ts
convivaAnalytics.updateContentMetadata({
  assetName: 'Your Asset Name',
});

// Initialize tracking session
convivaAnalytics.initializeSession();
```

3. Once your `Player` instance is ready attach it to the `ConvivaAnalytics` instance.

```ts
// ... Additional setup steps

const player = usePlayer();
convivaAnalytics.attachPlayer(player);
```

<a id="migration-from-manual-ios-configuration"></a>

## Migration to SharedObjects

Keep and reuse the `Player` and `ConvivaAnalytics` instances. Player attachment and
all Conviva and SSAI methods now pass native SharedObjects directly. `nativeId`
remains a deprecated JS compatibility alias; it is never resolved in native code.

Construction starts one native creation attempt. `initialize()` and all commands
await that same attempt. Concurrent initialization does not create duplicate
integrations. If creation fails, construct a new instance to retry.

Commands return promises so native failures can be handled by the caller:

```ts
await convivaAnalytics.initialize();
await convivaAnalytics.attachPlayer(player);
await convivaAnalytics.updateContentMetadata({ assetName: 'Art of Motion' });
await convivaAnalytics.ssai.reportAdBreakStarted();
await convivaAnalytics.ssai.reportAdStarted({ id: 'ad' });
await convivaAnalytics.ssai.reportAdFinished();
await convivaAnalytics.ssai.reportAdBreakFinished();
await convivaAnalytics.release();
```

`release()` and `destroy()` both end this integration's lifetime and wait for
pending initialization. Repeated release is safe. Create a new instance to start
tracking again. Unreachable integrations also release their native SDK resources
on the main thread. An attached integration keeps its Player SharedObject and JS
callbacks alive until release; it does not prevent an explicit `player.destroy()`.

The `ssai` helper belongs to its `ConvivaAnalytics` instance. Use that property
instead of constructing helpers by ID. iOS/tvOS view events still use
`setPlayerViewRef()` and the `PlayerView` reference.

## Configuration Options

| Option                       | Type   | Default                             | Description                                                  |
| ---------------------------- | ------ | ----------------------------------- | ------------------------------------------------------------ |
| `bitmovinConvivaIosVersion`  | string | Unset                               | Override the pinned Swift package with a compatible release. |
| `bitmovinConvivaIosRevision` | string | Revision in `ios/dependencies.json` | Override the Swift package revision.                         |

Choose either a version or a revision. A release must support the deployment targets
of the selected Player package. Version 3.7.0 declares iOS/tvOS 14 and cannot be used
with the Player package selected by this branch; the pinned revision raises it to 15.
