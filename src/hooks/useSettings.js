import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'guild_portfolio_settings_v1';

const DEFAULT_SETTINGS = {
  tierPreference: 'auto', // 'auto' | 'high' | 'medium' | 'low'
  soundEnabled: false,
  cursorTrailEnabled: true,
  headBobEnabled: true,
  reducedMotion: false,
};

function readStoredSettings() {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
      return { ...DEFAULT_SETTINGS, reducedMotion: prefersReduced };
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (err) {
    console.warn('Could not read settings from localStorage:', err);
    return DEFAULT_SETTINGS;
  }
}

function writeStoredSettings(settings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Could not save settings to localStorage:', err);
  }
}

// Global observable listeners to synchronize across components without context re-render thrashing
const listeners = new Set();
let currentSettings = readStoredSettings();

export function getSettings() {
  return currentSettings;
}

export function updateSettings(partial) {
  currentSettings = { ...currentSettings, ...partial };
  writeStoredSettings(currentSettings);
  listeners.forEach((cb) => cb(currentSettings));
}

export function useSettings() {
  const [settings, setSettings] = useState(currentSettings);

  useEffect(() => {
    const handler = (newSettings) => setSettings(newSettings);
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  const update = useCallback((partial) => {
    updateSettings(partial);
  }, []);

  return [settings, update];
}

