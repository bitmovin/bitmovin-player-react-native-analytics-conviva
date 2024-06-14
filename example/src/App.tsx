import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Switch,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
  Platform,
  AppState,
} from 'react-native';
import {
  PlayerView,
  SourceType,
  Player,
  AdSourceType,
} from 'bitmovin-player-react-native';
import validator from 'validator';
import { useTVGestures } from '../hooks';
import { ConvivaAnalytics } from 'bitmovin-player-react-native-analytics-conviva';

const CONVIVA_CUSTOMER_KEY = 'YOUR-CONVIVA-CUSTOMER-KEY';
const CONVIVA_GATEWAY_URL: string | undefined = undefined;

const withCorrelator = (tag: string): string =>
  `${tag}${Math.floor(Math.random() * 100000)}`;

const adTags = {
  vastSkippable: withCorrelator(
    'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator='
  ),
  vast1: withCorrelator(
    'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator='
  ),
  vast2: withCorrelator(
    'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/32573358/2nd_test_ad_unit&ciu_szs=300x100&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=%5Breferrer_url%5D&description_url=%5Bdescription_url%5D&correlator='
  ),
};

const advertisingConfig = {
  schedule: [
    {
      sources: [
        {
          tag: adTags.vastSkippable,
          type: AdSourceType.IMA,
        },
      ],
    },
    {
      position: '20%',
      sources: [
        {
          tag: adTags.vast1,
          type: AdSourceType.IMA,
        },
      ],
    },
    {
      position: 'post',
      sources: [
        {
          tag: adTags.vast2,
          type: AdSourceType.IMA,
        },
      ],
    },
  ],
};

export default function App() {
  useTVGestures();

  const adsEnabledRef = useRef(true);
  const assetUrlRef = useRef<string | undefined>(undefined);
  const createPlayer = useCallback(
    () =>
      new Player({
        playbackConfig: {
          isAutoplayEnabled: true,
          isMuted: true,
        },
        advertisingConfig: adsEnabledRef.current
          ? advertisingConfig
          : undefined,
      }),
    []
  );

  const [player, setPlayer] = useState(createPlayer());

  const createConvivaAnalytics = useCallback(async () => {
    const convivaAnalytics = new ConvivaAnalytics({
      player: player,
      customerKey: CONVIVA_CUSTOMER_KEY,
      debugLoggingEnabled: true,
      gatewayUrl: CONVIVA_GATEWAY_URL,
    });
    await convivaAnalytics.initialize();
    convivaAnalytics.updateContentMetadata({
      applicationName: 'Bitmovin iOS Conviva integration example app',
      viewerId: 'awesomeViewerId',
      custom: { custom_tag: 'Episode' },
      additionalStandardTags: { 'c3.cm.contentType': 'VOD' },
    });
    return convivaAnalytics;
  }, [player]);

  const [convivaAnalytics, setConvivaAnalytics] = useState<
    ConvivaAnalytics | undefined
  >(undefined);

  const loadAsset = useCallback(
    (url: string) =>
      player.load({
        url: url,
        type: SourceType.HLS,
        title: 'Art of Motion',
      }),
    [player]
  );

  const setupPlayer = useCallback(() => {
    setPlayer((prevPlayer) => {
      prevPlayer.destroy();
      return createPlayer();
    });
  }, [createPlayer]);

  const release = useCallback(() => {
    convivaAnalytics?.release();
    player.unload();
  }, [player, convivaAnalytics]);

  const pauseTracking = useCallback(() => {
    convivaAnalytics?.pauseTracking(false);
  }, [convivaAnalytics]);

  const resumeTracking = useCallback(() => {
    convivaAnalytics?.resumeTracking();
  }, [convivaAnalytics]);

  const sendCustomEvent = useCallback(async () => {
    const playerCurrentTime = await player.getCurrentTime();
    convivaAnalytics?.sendCustomPlaybackEvent('Custom Event', {
      'at Time': `${Math.floor(playerCurrentTime)}`,
    });
  }, [convivaAnalytics, player]);

  useEffect(() => {
    const urlToLoad =
      assetUrlRef.current !== undefined && validator.isURL(assetUrlRef.current)
        ? assetUrlRef.current
        : 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8';

    createConvivaAnalytics().then((newConvivaAnalytics) => {
      setConvivaAnalytics(newConvivaAnalytics);
      loadAsset(urlToLoad);
    });
  }, [createConvivaAnalytics, loadAsset]);

  const [adsEnabled, setAdsEnabled] = useState(true);

  useEffect(() => {
    adsEnabledRef.current = adsEnabled;
  }, [adsEnabled]);

  const lastAppState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (newAppState) => {
      if (Platform.OS === 'android') {
        if (
          lastAppState.current.match(/inactive|background/) &&
          newAppState === 'active'
        ) {
          console.log('App has come to the foreground!');
          convivaAnalytics?.reportAppForegrounded();
        } else if (
          lastAppState.current === 'active' &&
          newAppState.match(/inactive|background/)
        ) {
          console.log('App has gone to the background!');
          convivaAnalytics?.reportAppBackgrounded();
        }

        lastAppState.current = newAppState;
      }
    });

    return () => {
      subscription.remove();
    };
  }, [convivaAnalytics]);
  const playerViewRef = useRef(null);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      if (playerViewRef.current !== null) {
        convivaAnalytics?.setPlayerViewRef(playerViewRef);
      }
    }
  }, [convivaAnalytics]);

  const Container = Platform.isTV ? View : SafeAreaView;

  return (
    <Container style={styles.container}>
      <PlayerView
        style={styles.player}
        player={player}
        viewRef={playerViewRef}
      />
      {!Platform.isTV && (
        <>
          <View style={styles.adControlContainer}>
            <Text>Ads enabled</Text>
            <Switch value={adsEnabled} onValueChange={setAdsEnabled} />
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Custom stream url"
            textContentType="URL"
            onChangeText={(text) => {
              assetUrlRef.current = text;
            }}
          />
          <View style={styles.buttonContainer}>
            <Button
              title="Setup"
              onPress={() => {
                setupPlayer();
              }}
            />
            <Button title="Release" onPress={release} />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Pause tracking" onPress={pauseTracking} />
            <Button title="Resume Tracking" onPress={resumeTracking} />
          </View>
          <Button title="Send custom event" onPress={sendCustomEvent} />
        </>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  player: {
    aspectRatio: 16 / 9,
    backgroundColor: 'black',
  },
  adControlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    marginTop: 20,
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
});
