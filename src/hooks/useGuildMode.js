import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'guild_view_mode_v1';

function checkWebGLSupport() {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

function determineInitialMode() {
  if (typeof window === 'undefined') return { mode: '2d', reason: null };

  // 1. Explicit URL parameter override: ?mode=2d or ?mode=3d
  const params = new URLSearchParams(window.location.search);
  const modeParam = params.get('mode');
  if (modeParam === '2d') {
    return { mode: '2d', reason: 'URL parameter (?mode=2d)' };
  }
  if (modeParam === '3d') {
    return { mode: '3d', reason: null };
  }

  // 2. WebGL Support Verification
  if (!checkWebGLSupport()) {
    return { mode: '2d', reason: 'WebGL is not supported or disabled on this device.' };
  }

  // 3. Explicit User Stored Preference in localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === '2d') return { mode: '2d', reason: 'Saved user preference.' };
    if (stored === '3d') return { mode: '3d', reason: null };
  } catch {
    // Ignore localStorage access restrictions
  }

  // 4. Save-Data Enabled Check
  if (navigator.connection?.saveData) {
    return { mode: '2d', reason: 'Data Saver is enabled on your browser.' };
  }

  // 5. Low Memory Device Check (<= 2 GB RAM)
  if (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 2) {
    return { mode: '2d', reason: 'Low device memory reported.' };
  }

  // 6. Prefers-Reduced-Motion Accessibility Default
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
    return { mode: '2d', reason: 'System prefers reduced motion.' };
  }

  // 7. Mobile Safe Default: small viewport on touch-first device defaults to fast 2D
  const isMobile =
    window.innerWidth <= 640 &&
    (window.matchMedia?.('(pointer: coarse)')?.matches || navigator.maxTouchPoints > 0);
  if (isMobile) {
    return { mode: '2d', reason: 'Mobile device default (fast, battery-saving mode).' };
  }

  // Default to the full 3D Adventurers' Guild
  return { mode: '3d', reason: null };
}

export function useGuildMode() {
  const [modeState, setModeState] = useState(() => determineInitialMode());
  const [webGLSupported] = useState(() => checkWebGLSupport());

  const setMode = useCallback((newMode, userExplicit = true) => {
    setModeState((prev) => ({
      mode: newMode,
      reason: userExplicit ? null : prev.reason,
    }));
    if (userExplicit) {
      try {
        localStorage.setItem(STORAGE_KEY, newMode);
      } catch (err) {
        console.warn('Could not persist mode preference:', err);
      }
    }
  }, []);

  const triggerFallback = useCallback((reason) => {
    setModeState({ mode: '2d', reason });
  }, []);

  return {
    mode: modeState.mode,
    reason: modeState.reason,
    setMode,
    triggerFallback,
    isWebGLSupported: webGLSupported,
  };
}

