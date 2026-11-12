import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';
import { guildAudio } from '../audio/synth';

class IntroCinematicStore {
  constructor() {
    this.isPlaying = false;
    this.hasPlayed = false;
    this.progress = 1.0;
    this.doorAngle = Math.PI / 2; // Default fully open
    this.listeners = new Set();
  }

  start(prefersReducedMotion = false) {
    if (this.hasPlayed) return;
    this.hasPlayed = true;

    if (prefersReducedMotion) {
      this.isPlaying = false;
      this.progress = 1.0;
      this.doorAngle = Math.PI / 2;
      this.notify();
      return;
    }

    this.isPlaying = true;
    this.progress = 0.0;
    this.doorAngle = 0.0;
    this.notify();

    const startTime = performance.now();
    const duration = 3200; // 3.2 seconds

    const step = (time) => {
      if (!this.isPlaying) return;
      const elapsed = time - startTime;
      const t = Math.min(1.0, elapsed / duration);
      // Smooth cubic ease-in-out
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      this.progress = ease;
      // Doors swing outward from 0 to ~85 degrees
      this.doorAngle = (ease * Math.PI) / 2.1;
      this.notify();

      if (t < 1.0) {
        requestAnimationFrame(step);
      } else {
        this.complete();
      }
    };

    requestAnimationFrame(step);
  }

  skip() {
    if (!this.isPlaying) return;
    this.complete();
  }

  complete() {
    this.isPlaying = false;
    this.progress = 1.0;
    this.doorAngle = Math.PI / 2;
    this.notify();
    guildAudio.playStationArrival();
  }

  notify() {
    this.listeners.forEach((cb) => cb(this));
  }

  subscribe(cb) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }
}

export const introStore = new IntroCinematicStore();

export default function IntroCinematic({ isLoaded }) {
  const [settings] = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return introStore.subscribe((state) => {
      setIsPlaying(state.isPlaying);
    });
  }, []);

  useEffect(() => {
    if (isLoaded && !introStore.hasPlayed) {
      introStore.start(settings.reducedMotion);
    }
  }, [isLoaded, settings.reducedMotion]);

  // Handle skip with any key or mouse click
  const handleSkip = useCallback(() => {
    introStore.skip();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const onSkip = () => introStore.skip();
    window.addEventListener('keydown', onSkip);
    window.addEventListener('wheel', onSkip, { passive: true });
    window.addEventListener('touchstart', onSkip, { passive: true });
    return () => {
      window.removeEventListener('keydown', onSkip);
      window.removeEventListener('wheel', onSkip);
      window.removeEventListener('touchstart', onSkip);
    };
  }, [isPlaying]);

  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.div
          onClick={handleSkip}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9900,
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
        >
          {/* Bottom Skip Indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: '32px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '6px 16px',
              backgroundColor: 'rgba(20, 15, 24, 0.75)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '20px',
              color: '#ffb347',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              fontFamily: '"Cinzel", "Georgia", serif',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
              userSelect: 'none',
            }}
          >
            ✦ CLICK OR PRESS ANY KEY TO ENTER ✦
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
