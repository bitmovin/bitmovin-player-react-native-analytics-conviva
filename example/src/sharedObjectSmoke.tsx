import React, { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { Player, SourceType } from 'bitmovin-player-react-native';
import { ConvivaAnalytics } from 'bitmovin-player-react-native-analytics-conviva';

function check(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

// Runs against the real Expo bridge and SDKs. A dummy customer key keeps this
// separate from Touchstone validation and customer analytics sessions.
async function runSharedObjectSmoke(): Promise<void> {
  const player = new Player();
  const configured = new ConvivaAnalytics({
    player,
    customerKey: 'shared-object-smoke',
  });
  const standalone = new ConvivaAnalytics({
    customerKey: 'shared-object-smoke',
  });
  try {
    await Promise.all([configured.initialize(), configured.initialize()]);
    await configured.updateContentMetadata({ assetName: 'SharedObject smoke' });
    await configured.initializeSession();
    await configured.ssai.reportAdBreakStarted();
    check(await configured.ssai.isAdBreakActive(), 'Ad break did not start');
    // Ad metric submission requires a live Conviva session with a valid key.
    await configured.ssai.reportAdBreakFinished();
    check(
      !(await configured.ssai.isAdBreakActive()),
      'Ad break did not finish'
    );
    await configured.endSession();
    await player.load({
      url: 'https://cdn.bitmovin.com/content/internal/assets/MI201109210084/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
      type: SourceType.HLS,
      title: 'SharedObject smoke',
    });
    await player.unload();

    await standalone.attachPlayer(player);
    const nativePlayer = await player.native;
    check(
      (await standalone.native).player === nativePlayer,
      'Attached JS player was not retained'
    );
    const ignored = new Player();
    try {
      await standalone.attachPlayer(ignored);
      check(
        (await standalone.native).player === nativePlayer,
        'Repeated attachment replaced the player'
      );
    } finally {
      await ignored.destroy();
    }

    await configured.release();
    await configured.destroy();
    let rejectedAfterRelease = false;
    try {
      await configured.ssai.isAdBreakActive();
    } catch {
      rejectedAfterRelease = true;
    }
    check(rejectedAfterRelease, 'A command succeeded after release');

    const pending = new ConvivaAnalytics({
      customerKey: 'shared-object-smoke',
    });
    await pending.destroy();
    check(pending.isDestroyed, 'Pending destruction did not complete');
  } finally {
    await Promise.all([configured.destroy(), standalone.destroy()]);
    await player.destroy();
  }
}

export function SharedObjectSmoke(): React.JSX.Element {
  const [status, setStatus] = useState('Running SharedObject smoke');
  useEffect(() => {
    void runSharedObjectSmoke().then(
      () => {
        console.log(`CONVIVA_SHARED_OBJECT_SMOKE_PASS ${Platform.OS}`);
        setStatus('SharedObject smoke passed');
      },
      (error: unknown) => {
        console.error(`CONVIVA_SHARED_OBJECT_SMOKE_FAIL ${Platform.OS}`, error);
        setStatus(`SharedObject smoke failed: ${String(error)}`);
      }
    );
  }, []);
  return (
    <View style={{ padding: 32 }}>
      <Text>{status}</Text>
    </View>
  );
}
