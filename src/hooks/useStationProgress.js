import { useState, useEffect, useCallback, useRef } from 'react';
import { STATIONS } from '../data/stations';

/**
 * Global lightweight state listener for station progress.
 * Allows decoupling high-frequency 60fps Three.js scroll updates from React renders.
 */
class StationProgressStore {
  constructor() {
    this.listeners = new Set();
    this.scrollEl = null;
    this.state = {
      scrollProgress: 0,
      activeStationIndex: 0,
      activeStation: STATIONS[0],
      isDwelling: true,
      dwellFactor: 1, // 0 (moving) to 1 (full dwell)
      hasScrolled: false,
    };
  }

  setScrollEl(el) {
    this.scrollEl = el;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  updateProgress(rawProgress) {
    const progress = Math.max(0, Math.min(1, rawProgress));
    let activeIndex = 0;
    let isDwelling = false;
    let dwellFactor = 0;

    // Check dwell state against stations
    for (let i = 0; i < STATIONS.length; i++) {
      const station = STATIONS[i];
      const [start, end] = station.scrollRange;
      if (progress >= start && progress <= end) {
        activeIndex = i;
        isDwelling = true;
        // Dwell factor calculation (peak 1.0 at dwellCenter, ramp down near start/end)
        const halfWidth = (end - start) / 2;
        const distFromCenter = Math.abs(progress - station.dwellCenter);
        dwellFactor = Math.max(0, 1 - distFromCenter / halfWidth);
        break;
      }
    }

    // If in between stations, determine closest station
    if (!isDwelling) {
      let minDist = Infinity;
      for (let i = 0; i < STATIONS.length; i++) {
        const dist = Math.abs(progress - STATIONS[i].dwellCenter);
        if (dist < minDist) {
          minDist = dist;
          activeIndex = i;
        }
      }
      dwellFactor = 0;
    }

    const hasScrolled = this.state.hasScrolled || progress > 0.03;

    // Update if changed meaningfully
    const changed =
      Math.abs(this.state.scrollProgress - progress) > 0.001 ||
      this.state.activeStationIndex !== activeIndex ||
      this.state.isDwelling !== isDwelling ||
      Math.abs(this.state.dwellFactor - dwellFactor) > 0.05 ||
      this.state.hasScrolled !== hasScrolled;

    if (changed) {
      this.state = {
        scrollProgress: progress,
        activeStationIndex: activeIndex,
        activeStation: STATIONS[activeIndex],
        isDwelling,
        dwellFactor,
        hasScrolled,
      };
      this.notify();
    }
  }

  scrollToStation(targetIndex, smooth = true) {
    if (!this.scrollEl) return;
    const station = STATIONS[targetIndex];
    if (!station) return;

    const maxScroll = this.scrollEl.scrollHeight - this.scrollEl.clientHeight;
    const targetTop = station.dwellCenter * maxScroll;

    this.scrollEl.scrollTo({
      top: targetTop,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }
}

export const stationStore = new StationProgressStore();

/**
 * Custom hook to consume station progress in React components.
 */
export function useStationProgress() {
  const [state, setState] = useState(stationStore.state);

  useEffect(() => {
    return stationStore.subscribe(setState);
  }, []);

  const scrollToStation = useCallback((index, smooth = true) => {
    stationStore.scrollToStation(index, smooth);
  }, []);

  return {
    ...state,
    scrollToStation,
    stations: STATIONS,
  };
}

/**
 * Hook to detect prefers-reduced-motion
 */
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
}
