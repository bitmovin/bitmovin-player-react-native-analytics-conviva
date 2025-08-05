#!/bin/bash
# Build iOS project for simulator with formatted output

set -o pipefail
set -e

ARGS=$@

xcodebuild -workspace ios/BitmovinPlayerReactNativeAnalyticsConvivaExample.xcworkspace \
    -scheme BitmovinPlayerReactNativeAnalyticsConvivaExample \
    -configuration Debug \
    -destination 'generic/platform=iOS Simulator' \
    -quiet | xcbeautify -qq --disable-logging $ARGS
