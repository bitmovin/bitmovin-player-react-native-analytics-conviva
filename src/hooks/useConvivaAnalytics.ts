import { useRef } from 'react';
import { ConvivaAnalytics } from '../convivaAnalytics';
import type { Player } from 'bitmovin-player-react-native';
import type { ConvivaConfig } from '../convivaConfig';

export function useConvivaAnalytics(
  player: Player,
  customerKey: string,
  config: ConvivaConfig | undefined = undefined
): ConvivaAnalytics {
  return useRef(new ConvivaAnalytics(player, customerKey, config)).current;
}
