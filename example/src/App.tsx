import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import {
  usePlayer,
  PlayerView,
  SourceType,
} from 'bitmovin-player-react-native';
import { useTVGestures } from '../hooks';

export default function App() {
  useTVGestures();

  const player = usePlayer({
    playbackConfig: {
      isAutoplayEnabled: true,
    },
  });

  useEffect(() => {
    player.load({
      url: 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
      type: SourceType.HLS,
      title: 'Art of Motion',
    });
    return () => {
      player.destroy();
    };
  }, [player]);

  return (
    <SafeAreaView style={styles.container}>
      <PlayerView player={player} style={styles.player} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    marginHorizontal: 16,
  },
  player: {
    aspectRatio: 16 / 9,
    backgroundColor: 'black',
  },
});
