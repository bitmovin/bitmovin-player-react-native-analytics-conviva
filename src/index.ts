import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'bitmovin-player-react-native-analytics-conviva' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const BitmovinPlayerReactNativeAnalyticsConviva =
  NativeModules.BitmovinPlayerReactNativeAnalyticsConviva
    ? NativeModules.BitmovinPlayerReactNativeAnalyticsConviva
    : new Proxy(
        {},
        {
          get() {
            throw new Error(LINKING_ERROR);
          },
        }
      );

export function message(prefix: string): Promise<string> {
  console.log(NativeModules.BitmovinPlayerReactNativeAnalyticsConviva);
  return BitmovinPlayerReactNativeAnalyticsConviva.message(prefix);
}
