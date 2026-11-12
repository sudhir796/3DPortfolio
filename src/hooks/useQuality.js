import { useState, useEffect, useMemo } from 'react';
import { QUALITY_TIERS } from '../data/quality';
import { useSettings } from './useSettings';

let autoTier = 'high';
const autoTierListeners = new Set();

export function setAutoTier(tier) {
  if (['high', 'medium', 'low'].includes(tier) && autoTier !== tier) {
    autoTier = tier;
    autoTierListeners.forEach((cb) => cb(autoTier));
  }
}

export function useQuality() {
  const [settings] = useSettings();
  const [currentAutoTier, setCurrentAutoTier] = useState(autoTier);

  useEffect(() => {
    const handler = (tier) => setCurrentAutoTier(tier);
    autoTierListeners.add(handler);
    return () => autoTierListeners.delete(handler);
  }, []);

  const activeTierId = settings.tierPreference === 'auto' ? currentAutoTier : settings.tierPreference;

  const qualityConfig = useMemo(() => {
    return QUALITY_TIERS[activeTierId] || QUALITY_TIERS.high;
  }, [activeTierId]);

  return {
    tierId: activeTierId,
    config: qualityConfig,
    isAuto: settings.tierPreference === 'auto',
    setAutoTier,
  };
}

