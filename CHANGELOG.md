# Changelog

## [2.0.0]

### Breaking Change

- Introduction of Expo SDK support. Upgrading requires following the "Migration from Manual iOS Configuration" section in [README.md](README.md#migration-from-manual-ios-configuration)

### Added

- React Native New Architecture Support
- Expo Config Plugin to manage native configuration from `app.config.ts`.
- Automatic configuration for Bitmovin iOS Conviva Analytics dependency version through Expo plugin.

### Changed

- Minimum `bitmovin-player-react-native` version is now `1.0.0`
- Minimum iOS/tvOS version is now 15.1+ (was 14.0+). Due to a transient React Native minimum [iOS/tvOS version change](https://github.com/react-native-community/discussions-and-proposals/discussions/812).
- Minimum Android SDK version is now 24 (was 21). Due to a transient React Native minimum [Android version change](https://github.com/react-native-community/discussions-and-proposals/discussions/802).
- Native setup is now automated through Expo SDK - manual configuration is no longer required for v2.0.0+.

## [1.4.0] - 2024-09-06

### Changed

- Updated the Bitmovin Player Conviva Analytics Integration for Android dependency to `2.7.0`.

## [1.3.0] - 2024-08-28

### Added

- Possibility to start session tracking without a `Player` instance
  - `ConvivaAnalytics({ customerKey, config })` without a `Player`
  - `ConvivaAnalytics.attachPlayer(player)` to attach the `Player` at a later point in the session life-cycle

### Changed

- Updated the `bitmovin-player-react-native` dependency to `0.28.0`.
- Updated the Bitmovin Player Conviva Analytics Integration for iOS dependency to `3.4.1`.
- Updated the Bitmovin Player Conviva Analytics Integration for Android dependency to `2.6.0`.

## [1.2.0] - 2024-07-26

### Changed

- Updated the Bitmovin Player Conviva Analytics Integration for iOS dependency to `3.3.2`.

## [1.1.0] - 2024-07-08

### Added

- `ConvivaAnalytics.ssai` namespace to enable server side ad tracking

### Changed

- Updated the `bitmovin-player-react-native` dependency to `0.27.1`.
- Updated the Bitmovin Player Conviva Analytics Integration for Android dependency to `2.5.0`.
- Updated the Bitmovin Player Conviva Analytics Integration for iOS dependency to `3.3.0`.

## [1.0.0] - 2024-06-14

Adds support for Conviva Analytics with Bitmovin Player React Native SDK.

### Added

- `ConvivaAnalytics` class and related types to enable Conviva Analytics with Bitmovin Player React Native SDK.
- Simple React Native app under `example/` to showcase the integration.
