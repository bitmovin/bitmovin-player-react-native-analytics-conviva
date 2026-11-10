import { useState } from 'react';
import { ConvivaAnalytics } from '../convivaAnalytics';
import type { ConvivaAnalyticsConfig } from '../convivaAnalyticsConfig';

export function useConvivaAnalytics(
  config: ConvivaAnalyticsConfig
): ConvivaAnalytics {
  const [instance] = useState(() => new ConvivaAnalytics(config));
  return instance;
}
