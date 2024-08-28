# Changelog

## [1.3.0]

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
