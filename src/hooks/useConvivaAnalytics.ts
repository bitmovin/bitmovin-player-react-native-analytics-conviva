import { useRef } from 'react';
import { ConvivaAnalytics } from '../convivaAnalytics';
import type { ConvivaAnalyticsConfig } from '../convivaAnalyticsConfig';

export function useConvivaAnalytics(
  config: ConvivaAnalyticsConfig
): ConvivaAnalytics {
  return useRef(new ConvivaAnalytics(config)).current;
}
